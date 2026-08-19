import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberProfileView } from "@/components/member-profile";
import { getMemberProfileByUsername } from "@/lib/profiles/repository";

type MemberPageProps = { params: Promise<{ username: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getMemberProfileByUsername(username);
  if (!profile) return { title: "Member not found" };

  return {
    title: `${profile.displayName} (@${profile.username})`,
    description: profile.bio ?? `${profile.displayName}'s PH Otakus member profile.`,
  };
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { username } = await params;
  const profile = await getMemberProfileByUsername(username);
  if (!profile) notFound();

  return <MemberProfileView profile={profile} />;
}
