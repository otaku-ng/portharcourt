"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import {
  createGalleryAlbum,
  galleryEventExists,
  getAdminGalleryAlbumById,
  isUniqueGallerySlugError,
  setGalleryAlbumPublished,
  updateGalleryAlbum,
  type GalleryAlbumWriteData,
  type GalleryImageWriteData,
} from "@/lib/gallery/repository";
import { getZodFieldErrors } from "@/lib/events/validation";
import { getPublicUrlForObjectKey, isSafeGalleryObjectKey } from "@/lib/storage/r2";
import { normalizeSlug, parseGalleryForm } from "@/lib/gallery/validation";

export type GalleryActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const unauthenticatedState: GalleryActionState = {
  error: "Your admin session has expired. Sign in again.",
};

function getId(formData: FormData): string | null {
  const value = formData.get("id");
  return typeof value === "string" && value ? value : null;
}

function getReturnPath(formData: FormData): string {
  const value = formData.get("returnTo");
  return typeof value === "string" && value.startsWith("/admin/") && !value.startsWith("//")
    ? value
    : "/admin/gallery";
}

function revalidateGalleryPaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/gallery/${previousSlug}`);
}

async function getWriteData(
  input: NonNullable<ReturnType<typeof parseGalleryForm>["data"]>,
): Promise<GalleryAlbumWriteData | { error: string }> {
  if (input.eventId) {
    try {
      if (!(await galleryEventExists(input.eventId))) return { error: "Choose an existing event or leave the event field blank." };
    } catch {
      return { error: "The associated event could not be verified. Try again." };
    }
  }

  return {
    slug: normalizeSlug(input.slug, input.title),
    title: input.title,
    description: input.description,
    eventId: input.eventId,
    date: input.date,
    published: input.published,
  };
}

function getImageWriteData(
  images: NonNullable<ReturnType<typeof parseGalleryForm>["data"]>["images"],
  existingImages: Array<{ id: string; objectKey: string | null; url: string }>,
): GalleryImageWriteData[] | { error: string } {
  const existingById = new Map(existingImages.map((image) => [image.id, image]));
  const seenObjectKeys = new Set<string>();

  try {
    return images.map((image, sortOrder) => {
      if (image.id) {
        const existing = existingById.get(image.id);
        if (!existing || (image.objectKey || null) !== existing.objectKey) {
          throw new Error("One of the existing images is no longer valid. Refresh and try again.");
        }

        return {
          objectKey: existing.objectKey,
          url: existing.url,
          alt: image.alt,
          caption: image.caption,
          sortOrder,
        };
      }

      if (!image.objectKey || !isSafeGalleryObjectKey(image.objectKey)) {
        throw new Error("One of the uploaded image references is invalid. Upload it again.");
      }
      if (seenObjectKeys.has(image.objectKey)) {
        throw new Error("An image was added more than once. Remove the duplicate and try again.");
      }
      seenObjectKeys.add(image.objectKey);

      return {
        objectKey: image.objectKey,
        url: getPublicUrlForObjectKey(image.objectKey),
        alt: image.alt,
        caption: image.caption,
        sortOrder,
      };
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The gallery images could not be saved." };
  }
}

export async function createGalleryAlbumAction(
  _previousState: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  if (!(await requireAdmin())) return unauthenticatedState;

  const parsed = parseGalleryForm(formData);
  if (!parsed.success) return { fieldErrors: getZodFieldErrors(parsed.error), error: "Check the highlighted fields." };

  const slug = normalizeSlug(parsed.data.slug, parsed.data.title);
  if (!slug) return { fieldErrors: { slug: "Add a title that can be used as a slug." } };

  const writeData = await getWriteData(parsed.data);
  if ("error" in writeData) return { error: writeData.error };
  const images = getImageWriteData(parsed.data.images, []);
  if ("error" in images) return { error: images.error };

  let album;
  try {
    album = await createGalleryAlbum({ ...writeData, slug }, images);
    revalidateGalleryPaths(album.slug);
  } catch (error) {
    if (isUniqueGallerySlugError(error)) return { fieldErrors: { slug: "That slug is already in use." }, error: "Choose a different slug." };
    return { error: "Could not save the album. Check the fields and try again." };
  }

  redirect(`/admin/gallery/${album.id}`);
}

export async function updateGalleryAlbumAction(
  _previousState: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  if (!(await requireAdmin())) return unauthenticatedState;

  const id = getId(formData);
  if (!id) return { error: "This album could not be identified." };

  const existingAlbum = await getAdminGalleryAlbumById(id);
  if (!existingAlbum) return { error: "This album no longer exists." };

  const parsed = parseGalleryForm(formData);
  if (!parsed.success) return { fieldErrors: getZodFieldErrors(parsed.error), error: "Check the highlighted fields." };

  const slug = normalizeSlug(parsed.data.slug, parsed.data.title);
  if (!slug) return { fieldErrors: { slug: "Add a title that can be used as a slug." } };

  const writeData = await getWriteData(parsed.data);
  if ("error" in writeData) return { error: writeData.error };
  const images = getImageWriteData(parsed.data.images, existingAlbum.images);
  if ("error" in images) return { error: images.error };

  try {
    const album = await updateGalleryAlbum(id, { ...writeData, slug }, images);
    revalidateGalleryPaths(album.slug, existingAlbum.slug);
  } catch (error) {
    if (isUniqueGallerySlugError(error)) return { fieldErrors: { slug: "That slug is already in use." }, error: "Choose a different slug." };
    return { error: "Could not save the album. Check the fields and try again." };
  }

  redirect("/admin/gallery");
}

export async function setGalleryPublishedAction(formData: FormData): Promise<void> {
  if (!(await requireAdmin())) redirect("/admin/login");

  const id = getId(formData);
  if (!id) redirect(getReturnPath(formData));

  try {
    const album = await setGalleryAlbumPublished(id, formData.get("published") === "true");
    revalidateGalleryPaths(album.slug);
  } catch {
    redirect(`${getReturnPath(formData)}?error=publication`);
  }

  redirect(getReturnPath(formData));
}
