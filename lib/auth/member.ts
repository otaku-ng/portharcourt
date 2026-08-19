import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMemberById } from "@/lib/members/repository";

export type MemberContext = {
  userId: string;
  user: NonNullable<Awaited<ReturnType<typeof getMemberById>>>;
};

function isNextDynamicServerUsage(error: unknown): boolean {
  return typeof error === "object" && error !== null && "digest" in error && error.digest === "DYNAMIC_SERVER_USAGE";
}

export async function getMember(): Promise<MemberContext | null> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return null;

    const user = await getMemberById(userId);
    if (!user) {
      throw new Error("The signed-in member could not be loaded.");
    }

    return { userId, user };
  } catch (error) {
    if (!isNextDynamicServerUsage(error)) {
      console.error("[auth] Unexpected member lookup failure", {
        error: error instanceof Error ? { name: error.name, message: error.message } : { message: "Unknown error" },
      });
    }
    throw error;
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
