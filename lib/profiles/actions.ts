"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/auth/member";
import {
  getEditableProfileByUserId,
  isUniqueUsernameError,
  updateProfile,
} from "@/lib/profiles/repository";
import {
  getZodFieldErrors,
  isReservedUsername,
  normalizeUsername,
  parseProfileForm,
} from "@/lib/profiles/validation";
import { getPublicUrlForObjectKey, isSafeProfileObjectKey } from "@/lib/storage/r2";

export type ProfileActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const member = await getMember();
  if (!member) return { error: "Your member session has expired. Sign in again." };

  const parsed = parseProfileForm(formData);
  if (!parsed.success) return { error: "Check the highlighted fields.", fieldErrors: getZodFieldErrors(parsed.error) };

  const username = normalizeUsername(parsed.data.username);
  if (isReservedUsername(username)) {
    return { error: "Choose a different username.", fieldErrors: { username: "That name is reserved for PH Otakus pages." } };
  }

  const existingProfile = await getEditableProfileByUserId(member.userId);
  const avatar = resolveProfileMedia(formData, "avatar", member.userId, existingProfile?.avatarUrl ?? null, existingProfile?.avatarKey ?? null);
  const banner = resolveProfileMedia(formData, "banner", member.userId, existingProfile?.bannerUrl ?? null, existingProfile?.bannerKey ?? null);
  if ("error" in avatar || "error" in banner) {
    const fieldErrors: Record<string, string> = {};
    if ("error" in avatar) fieldErrors.avatarKey = avatar.error;
    if ("error" in banner) fieldErrors.bannerKey = banner.error;
    return { error: "One of the image references is invalid. Upload it again.", fieldErrors };
  }

  try {
    const profile = await updateProfile(member.userId, {
      ...parsed.data,
      username,
      avatarUrl: avatar.url,
      avatarKey: avatar.key,
      bannerUrl: banner.url,
      bannerKey: banner.key,
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");
    revalidatePath("/profile/setup");
    revalidatePath(`/members/${profile.username}`);
    revalidatePath("/community/members");
    if (existingProfile?.username && existingProfile.username !== profile.username) revalidatePath(`/members/${existingProfile.username}`);
  } catch (error) {
    if (isUniqueUsernameError(error)) {
      return { error: "That username is already in use.", fieldErrors: { username: "Try another username." } };
    }
    return { error: "Could not save your profile. Try again." };
  }

  redirect("/profile");
}

function resolveProfileMedia(
  formData: FormData,
  kind: "avatar" | "banner",
  userId: string,
  existingUrl: string | null,
  existingKey: string | null,
): { url: string | null; key: string | null } | { error: string } {
  const keyValue = formData.get(`${kind}Key`);
  const key = typeof keyValue === "string" ? keyValue.trim() : "";
  const remove = formData.get(`${kind}Remove`) === "true";

  if (remove) return { url: null, key: null };
  if (!key) return { url: existingUrl, key: existingKey };
  if (!isSafeProfileObjectKey(key, userId, kind)) return { error: "The uploaded image reference is invalid." };

  try {
    return { url: getPublicUrlForObjectKey(key), key };
  } catch {
    return { error: "The image storage is not configured for this upload." };
  }
}
