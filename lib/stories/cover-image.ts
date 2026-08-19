import { getPublicUrlForObjectKey, isSafeStoryObjectKey } from "@/lib/storage/r2";
import type { AdminStory } from "@/lib/stories/types";

function isSafeLegacyImagePath(value: string): boolean {
  return value.startsWith("/figma/") && !value.includes("..") && !value.includes("\\");
}

export function resolveStoryCoverImage(
  coverImageKey: string | null,
  existingStory?: Pick<AdminStory, "coverImageUrl" | "coverImageKey"> | null,
): { coverImageKey: string | null; coverImageUrl: string } | { error: string } {
  if (coverImageKey) {
    if (!isSafeStoryObjectKey(coverImageKey)) {
      return { error: "The uploaded image reference is invalid. Upload the image again." };
    }

    try {
      return { coverImageKey, coverImageUrl: getPublicUrlForObjectKey(coverImageKey) };
    } catch {
      return { error: "The image storage is not configured for this upload." };
    }
  }

  if (existingStory) {
    return { coverImageKey: existingStory.coverImageKey, coverImageUrl: existingStory.coverImageUrl };
  }

  return { error: "Upload a cover image before saving the story." };
}

export function canUseLegacyStoryImage(value: string | null): boolean {
  return Boolean(value && isSafeLegacyImagePath(value));
}
