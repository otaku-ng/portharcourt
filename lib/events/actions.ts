"use server";

import { EventStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { evaluateBadgesForCompletedEvent } from "@/lib/badges/service";
import { resolveEventCoverImage } from "@/lib/events/cover-image";
import {
  createEvent,
  getAdminEventById,
  isUniqueSlugError,
  publishEvent,
  unpublishEvent,
  updateEvent,
  type EventWriteData,
} from "@/lib/events/repository";
import { getZodFieldErrors, normalizeSlug, parseEventForm } from "@/lib/events/validation";

export type EventActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const unauthenticatedState: EventActionState = {
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
    : "/admin/events";
}

function revalidateEventPaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/events/${previousSlug}`);
}

async function evaluateCompletedEventBadges(eventId: string, eventSlug: string): Promise<void> {
  try {
    const evaluatedMembers = await evaluateBadgesForCompletedEvent(eventId);
    if (evaluatedMembers.length === 0) return;

    revalidatePath("/profile");
    revalidatePath(`/events/${eventSlug}`);
    for (const member of evaluatedMembers) {
      if (member.username) revalidatePath(`/members/${member.username}`);
    }
  } catch (error) {
    console.error("[events] Event saved, but completed-event badge evaluation could not start", {
      eventId,
      eventSlug,
      error: error instanceof Error ? { name: error.name, message: error.message } : { message: "Unknown error" },
    });
  }
}

function getWriteData(
  input: NonNullable<ReturnType<typeof parseEventForm>["data"]>,
  coverImage: { coverImageKey: string | null; coverImageUrl: string },
  slug: string,
): EventWriteData {
  return {
    slug,
    title: input.title,
    eyebrow: input.eyebrow,
    description: input.description,
    startAt: input.startAt,
    endAt: input.endAt,
    dateLabel: input.dateLabel,
    timeLabel: input.timeLabel,
    location: input.location,
    venue: input.venue,
    coverImageUrl: coverImage.coverImageUrl,
    coverImageKey: coverImage.coverImageKey,
    coverImageAlt: input.coverImageAlt,
    status: input.status === "UPCOMING" ? EventStatus.UPCOMING : EventStatus.ARCHIVED,
    published: input.published,
  };
}

export async function createEventAction(
  _previousState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  if (!(await requireAdmin())) return unauthenticatedState;

  const parsed = parseEventForm(formData);
  if (!parsed.success) return { fieldErrors: getZodFieldErrors(parsed.error), error: "Check the highlighted fields." };

  const slug = normalizeSlug(parsed.data.slug, parsed.data.title);
  if (!slug) return { fieldErrors: { slug: "Add a title that can be used as a slug." } };

  const coverImage = resolveEventCoverImage(parsed.data.coverImageKey);
  if ("error" in coverImage) return { fieldErrors: { coverImageKey: coverImage.error } };

  try {
    const event = await createEvent(getWriteData(parsed.data, coverImage, slug));
    revalidateEventPaths(event.slug);
  } catch (error) {
    if (isUniqueSlugError(error)) return { fieldErrors: { slug: "That slug is already in use." }, error: "Choose a different slug." };
    return { error: "Could not save the event. Check the fields and try again." };
  }

  redirect("/admin/events");
}

export async function updateEventAction(
  _previousState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  if (!(await requireAdmin())) return unauthenticatedState;

  const id = getId(formData);
  if (!id) return { error: "This event could not be identified." };

  const existingEvent = await getAdminEventById(id);
  if (!existingEvent) return { error: "This event no longer exists." };

  const parsed = parseEventForm(formData);
  if (!parsed.success) return { fieldErrors: getZodFieldErrors(parsed.error), error: "Check the highlighted fields." };

  const slug = normalizeSlug(parsed.data.slug, parsed.data.title);
  if (!slug) return { fieldErrors: { slug: "Add a title that can be used as a slug." } };

  const coverImage = resolveEventCoverImage(parsed.data.coverImageKey, existingEvent);
  if ("error" in coverImage) return { fieldErrors: { coverImageKey: coverImage.error } };

  let event;
  try {
    event = await updateEvent(id, getWriteData(parsed.data, coverImage, slug));
  } catch (error) {
    if (isUniqueSlugError(error)) return { fieldErrors: { slug: "That slug is already in use." }, error: "Choose a different slug." };
    return { error: "Could not save the event. Check the fields and try again." };
  }

  revalidateEventPaths(event.slug, existingEvent.slug);
  if (existingEvent.status === EventStatus.UPCOMING && event.status === EventStatus.ARCHIVED) {
    await evaluateCompletedEventBadges(event.id, event.slug);
  }

  redirect("/admin/events");
}

export async function setEventPublishedAction(formData: FormData): Promise<void> {
  if (!(await requireAdmin())) redirect("/admin/login");

  const id = getId(formData);
  if (!id) redirect(getReturnPath(formData));

  try {
    const published = formData.get("published") === "true";
    const event = published ? await publishEvent(id) : await unpublishEvent(id);
    revalidateEventPaths(event.slug);
  } catch {
    redirect(`${getReturnPath(formData)}?error=publication`);
  }

  redirect(getReturnPath(formData));
}
