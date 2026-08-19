import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { requireMember } from "@/lib/auth/member";
import { getMemberProfileByUserId } from "@/lib/profiles/repository";
import { toProfileFormValues } from "@/lib/profiles/validation";
import { displayHeading, kicker, shell } from "@/lib/tailwind";

export const metadata: Metadata = {
  title: "Edit profile",
  description: "Update your PH Otakus member profile.",
};

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const member = await requireMember("/profile/edit");
  const profile = await getMemberProfileByUserId(member.userId);
  if (!profile) redirect("/profile/setup");

  return (
    <main className="overflow-hidden">
      <section className={`${shell} py-[clamp(65px,9vw,120px)]`}>
        <div className="max-w-[1000px]">
          <p className={kicker}><span className="text-brand-red">Your profile</span> Keep it current</p>
          <h1 className={`${displayHeading} mt-5 text-[clamp(4rem,9vw,9rem)]`}>Edit your <em className="font-inherit not-italic text-brand-red">identity.</em></h1>
          <div className="mt-12"><ProfileForm initial={toProfileFormValues(profile)} mode="edit" /></div>
        </div>
      </section>
    </main>
  );
}
