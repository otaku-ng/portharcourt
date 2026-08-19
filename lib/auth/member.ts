import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMemberById } from "@/lib/members/repository";

export type MemberContext = {
  userId: string;
  user: NonNullable<Awaited<ReturnType<typeof getMemberById>>>;
};

export async function getMember(): Promise<MemberContext | null> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return null;

    const user = await getMemberById(userId);
    return user ? { userId, user } : null;
  } catch {
    return null;
  }
}

function safeCallbackUrl(callbackUrl: string): string {
  return callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/profile";
}

export async function requireMember(callbackUrl = "/profile"): Promise<MemberContext> {
  const member = await getMember();
  if (!member) redirect(`/signin?callbackUrl=${encodeURIComponent(safeCallbackUrl(callbackUrl))}`);
  return member;
}

export async function requireCompletedProfile(callbackUrl = "/profile"): Promise<MemberContext> {
  const member = await requireMember(callbackUrl);
  if (!member.user.profile?.profileCompleted) redirect("/profile/setup");
  return member;
}
