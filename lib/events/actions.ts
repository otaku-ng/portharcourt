"use server";

import { EventMediaType, EventStatus } from "@prisma/client";
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
  type EventMediaWriteData,
  type EventWriteData,
} from "@/lib/events/repository";
import { getZodFieldErrors, normalizeSlug, parseEventForm } from "@/lib/events/validation";
import { getPublicUrlForEventMediaObjectKey, isSafeEventMediaObjectKey } from "@/lib/storage/r2";

export type EventActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const unauthenticatedState: EventActionState = {
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
    content: input.content,
    registrationUrl: input.registrationUrl,
    registrationLabel: input.registrationLabel,
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

function getMediaWriteData(
  media: NonNullable<ReturnType<typeof parseEventForm>["data"]>["media"],
  existingMedia: Array<{ id: string; objectKey: string | null; url: string }>,
  eventId: string,
): EventMediaWriteData[] | { error: string } {
  const existingById = new Map(existingMedia.map((item) => [item.id, item]));
  const seenIds = new Set<string>();
  const seenObjectKeys = new Set(existingMedia.map((item) => item.objectKey).filter((key): key is string => Boolean(key)));

  try {
    return media.map((item, sortOrder) => {
      if (item.id) {
        const existing = existingById.get(item.id);
        if (!existing || seenIds.has(item.id) || (item.objectKey || null) !== existing.objectKey) {
          throw new Error("One of the existing media items is no longer valid. Refresh and try again.");
        }
        seenIds.add(item.id);

        return {
          objectKey: existing.objectKey,
          url: existing.url,
          alt: item.alt,
          caption: item.caption,
          type: item.type === "FLYER" ? EventMediaType.FLYER : EventMediaType.IMAGE,
          sortOrder,
        };
      }

      const objectKey = item.objectKey?.trim() || "";
      if (!objectKey || !isSafeEventMediaObjectKey(objectKey, eventId)) {
        throw new Error("One of the uploaded media references is invalid. Upload it again.");
      }
      if (seenObjectKeys.has(objectKey)) {
        throw new Error("A media item was added more than once. Remove the duplicate and try again.");
      }
      seenObjectKeys.add(objectKey);

      return {
        objectKey,
        url: getPublicUrlForEventMediaObjectKey(objectKey, eventId),
        alt: item.alt,
        caption: item.caption,
        type: item.type === "FLYER" ? EventMediaType.FLYER : EventMediaType.IMAGE,
        sortOrder,
      };
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The event media could not be saved." };
  }
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
  if (parsed.data.media.length > 0) return { fieldErrors: { media: "Save the event before adding media." } };

  let event: Awaited<ReturnType<typeof createEvent>>;
  try {
    event = await createEvent(getWriteData(parsed.data, coverImage, slug));
    revalidateEventPaths(event.slug);
  } catch (error) {
    if (isUniqueSlugError(error)) return { fieldErrors: { slug: "That slug is already in use." }, error: "Choose a different slug." };
    return { error: "Could not save the event. Check the fields and try again." };
  }

  redirect(`/admin/events/${event.id}`);
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
    const media = getMediaWriteData(parsed.data.media, existingEvent.media, id);
    if ("error" in media) return { fieldErrors: { media: media.error }, error: "Check the event media." };
    event = await updateEvent(id, getWriteData(parsed.data, coverImage, slug), media);
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
  if (!(await requireAdmin("/admin/events"))) redirect("/admin");

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
