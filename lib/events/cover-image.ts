import { getPublicUrlForEventObjectKey, isSafeEventObjectKey } from "@/lib/storage/r2";
import type { AdminEvent } from "@/lib/events/repository";

function isSafeLegacyImagePath(value: string): boolean {
  return value.startsWith("/figma/") && !value.includes("..") && !value.includes("\\");
}

export function resolveEventCoverImage(
  coverImageKey: string | null,
  existingEvent?: Pick<AdminEvent, "coverImageUrl" | "coverImageKey"> | null,
): { coverImageKey: string | null; coverImageUrl: string } | { error: string } {
  if (coverImageKey) {
    if (!isSafeEventObjectKey(coverImageKey)) {
      return { error: "The uploaded image reference is invalid. Upload the image again." };
    }

    try {
      return {
        coverImageKey,
        coverImageUrl: getPublicUrlForEventObjectKey(coverImageKey),
      };
    } catch {
      return { error: "The image storage is not configured for this upload." };
    }
  }

  if (existingEvent) {
    return {
      coverImageKey: existingEvent.coverImageKey,
      coverImageUrl: existingEvent.coverImageUrl,
    };
  }

  return { error: "Upload a cover image before saving the event." };
}

export function canUseLegacyCoverImage(value: string | null): boolean {
  return Boolean(value && isSafeLegacyImagePath(value));
}
