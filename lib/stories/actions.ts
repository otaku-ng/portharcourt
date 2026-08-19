"use server";

import { StoryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { resolveStoryCoverImage } from "@/lib/stories/cover-image";
import {
  createStory,
  getAdminStoryById,
  isUniqueStorySlugError,
  setStoryPublished,
  updateStory,
  type StoryWriteData,
} from "@/lib/stories/repository";
import { getZodFieldErrors } from "@/lib/events/validation";
import { normalizeSlug, parseStoryForm } from "@/lib/stories/validation";

export type StoryActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const unauthenticatedState: StoryActionState = {
  error: "Your admin access has changed. Sign in again or ask a super admin to update your role.",
};

function getId(formData: FormData): string | null {
  const value = formData.get("id");
  return typeof value === "string" && value ? value : null;
}

function getReturnPath(formData: FormData): string {
  const value = formData.get("returnTo");
  return typeof value === "string" && value.startsWith("/admin/") && !value.startsWith("//")
    ? value
    : "/admin/stories";
}

function revalidateStoryPaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/blog/${previousSlug}`);
}

function getWriteData(
  input: NonNullable<ReturnType<typeof parseStoryForm>["data"]>,
  coverImage: { coverImageKey: string | null; coverImageUrl: string },
  slug: string,
  publishedAt: Date | null,
): StoryWriteData {
  return {
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    coverImageUrl: coverImage.coverImageUrl,
    coverImageKey: coverImage.coverImageKey,
    coverImageAlt: input.coverImageAlt,
    status: input.published ? StoryStatus.PUBLISHED : StoryStatus.DRAFT,
    publishedAt,
  };
}

export async function createStoryAction(
  _previousState: StoryActionState,
  formData: FormData,
): Promise<StoryActionState> {
  if (!(await requireAdmin())) return unauthenticatedState;

  const parsed = parseStoryForm(formData);
  if (!parsed.success) return { fieldErrors: getZodFieldErrors(parsed.error), error: "Check the highlighted fields." };

  const slug = normalizeSlug(parsed.data.slug, parsed.data.title);
  if (!slug) return { fieldErrors: { slug: "Add a title that can be used as a slug." } };

  const coverImage = resolveStoryCoverImage(parsed.data.coverImageKey);
  if ("error" in coverImage) return { fieldErrors: { coverImageKey: coverImage.error } };

  let story;
  try {
    story = await createStory(getWriteData(parsed.data, coverImage, slug, parsed.data.published ? new Date() : null));
    revalidateStoryPaths(story.slug);
  } catch (error) {
    if (isUniqueStorySlugError(error)) return { fieldErrors: { slug: "That slug is already in use." }, error: "Choose a different slug." };
    return { error: "Could not save the story. Check the fields and try again." };
  }

  redirect("/admin/stories");
}

export async function updateStoryAction(
  _previousState: StoryActionState,
  formData: FormData,
): Promise<StoryActionState> {
  if (!(await requireAdmin())) return unauthenticatedState;

  const id = getId(formData);
  if (!id) return { error: "This story could not be identified." };

  const existingStory = await getAdminStoryById(id);
  if (!existingStory) return { error: "This story no longer exists." };

  const parsed = parseStoryForm(formData);
  if (!parsed.success) return { fieldErrors: getZodFieldErrors(parsed.error), error: "Check the highlighted fields." };

  const slug = normalizeSlug(parsed.data.slug, parsed.data.title);
  if (!slug) return { fieldErrors: { slug: "Add a title that can be used as a slug." } };

  const coverImage = resolveStoryCoverImage(parsed.data.coverImageKey, existingStory);
  if ("error" in coverImage) return { fieldErrors: { coverImageKey: coverImage.error } };

  const publishedAt = parsed.data.published ? existingStory.publishedAt ?? new Date() : null;

  try {
    const story = await updateStory(id, getWriteData(parsed.data, coverImage, slug, publishedAt));
    revalidateStoryPaths(story.slug, existingStory.slug);
  } catch (error) {
    if (isUniqueStorySlugError(error)) return { fieldErrors: { slug: "That slug is already in use." }, error: "Choose a different slug." };
    return { error: "Could not save the story. Check the fields and try again." };
  }

  redirect("/admin/stories");
}

export async function setStoryPublishedAction(formData: FormData): Promise<void> {
  if (!(await requireAdmin("/admin/stories"))) redirect("/admin");

  const id = getId(formData);
  if (!id) redirect(getReturnPath(formData));

  try {
    const story = await setStoryPublished(id, formData.get("published") === "true");
    revalidateStoryPaths(story.slug);
  } catch {
    redirect(`${getReturnPath(formData)}?error=publication`);
  }

  redirect(getReturnPath(formData));
}
