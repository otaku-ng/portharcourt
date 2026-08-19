import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MemberProfileView } from "@/components/member-profile";
import { requireCompletedProfile } from "@/lib/auth/member";
import { getMemberProfileByUserId } from "@/lib/profiles/repository";

export const metadata: Metadata = {
  title: "My profile",
  description: "Your PH Otakus member profile, event activity and Otaku Passport.",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const member = await requireCompletedProfile("/profile");
  const profile = await getMemberProfileByUserId(member.userId);
  if (!profile) redirect("/profile/setup");

  return <MemberProfileView profile={profile} own />;
}
