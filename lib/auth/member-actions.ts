"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { signOut } from "@/auth";
import { getMember } from "@/lib/auth/member";
import { assertMemberAccountCanBeDeleted, deleteMemberAccount, LastSuperAdminDeletionError } from "@/lib/members/repository";
import { deleteProfileMedia } from "@/lib/storage/r2";

export type DeleteAccountActionState = {
  error?: string;
};

export async function memberSignOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function deleteAccountAction(
  _previousState: DeleteAccountActionState,
  formData: FormData,
): Promise<DeleteAccountActionState> {
  const member = await getMember();
  if (!member) return { error: "Your member session has expired. Sign in again." };

  const confirmation = formData.get("confirmation");
  if (confirmation !== "DELETE") {
    return { error: "Type DELETE to confirm that you want to remove your account." };
  }

  const username = member.user.profile?.username;

  try {
    await assertMemberAccountCanBeDeleted(member.userId);
    // Clean external personal media before deleting the database aggregate. If
    // storage cleanup fails, the account remains available for a retry.
    await deleteProfileMedia(member.userId);
    await deleteMemberAccount(member.userId);
  } catch (error) {
    if (error instanceof LastSuperAdminDeletionError) return { error: error.message };
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return { error: "The account changed while it was being deleted. Try again." };
    }
    console.error("[auth] Account deletion failed", {
      userId: member.userId,
      error: error instanceof Error ? { name: error.name, message: error.message } : { message: "Unknown error" },
    });
    return { error: "We could not fully delete your account. Nothing in the database was removed; try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/profile/setup");
  revalidatePath("/community/members");
  revalidatePath("/sitemap.xml");
  if (username) revalidatePath(`/members/${username}`);

  // Auth.js clears the database-session cookie even though the User cascade
  // already removed its session row.
  await signOut({ redirectTo: "/" });
  return {};
}
