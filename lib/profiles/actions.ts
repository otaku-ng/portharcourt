"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/auth/member";
import {
  getMemberProfileByUserId,
  isUniqueUsernameError,
  updateProfile,
} from "@/lib/profiles/repository";
import {
  getZodFieldErrors,
  isReservedUsername,
  normalizeUsername,
  parseProfileForm,
} from "@/lib/profiles/validation";

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

  const existingProfile = await getMemberProfileByUserId(member.userId);
  try {
    const profile = await updateProfile(member.userId, {
      ...parsed.data,
      username,
      avatarUrl: existingProfile?.avatarUrl ?? member.user.image,
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");
    revalidatePath("/profile/setup");
    revalidatePath(`/members/${profile.username}`);
  } catch (error) {
    if (isUniqueUsernameError(error)) {
      return { error: "That username is already in use.", fieldErrors: { username: "Try another username." } };
    }
    return { error: "Could not save your profile. Try again." };
  }

  redirect("/profile");
}
