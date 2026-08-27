import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberProfileView } from "@/components/member-profile";
import { getMemberProfileByUsername } from "@/lib/profiles/repository";

type MemberPageProps = { params: Promise<{ username: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getMemberProfileByUsername(username);
  if (!profile) notFound();

  const description = profile.bio?.trim() || `${profile.displayName} (@${profile.username}) is part of the PH Otakus community in Port Harcourt.`;
  const previewImage = profile.bannerUrl ?? profile.avatarUrl ?? profile.image ?? "/figma/home-05.jpg";

  return {
    title: `${profile.displayName} (@${profile.username})`,
    description,
    alternates: { canonical: `/members/${profile.username}` },
    openGraph: {
      title: `${profile.displayName} (@${profile.username})`,
      description,
      siteName: "PH Otakus",
      type: "profile",
      url: `/members/${profile.username}`,
      images: [{ url: previewImage, alt: `${profile.displayName}'s PH Otakus profile` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.displayName} (@${profile.username})`,
      description,
      images: [previewImage],
    },
  };
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { username } = await params;
  const profile = await getMemberProfileByUsername(username);
  if (!profile) notFound();

  return <MemberProfileView profile={profile} />;
}
