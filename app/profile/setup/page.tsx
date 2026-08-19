import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { getMember } from "@/lib/auth/member";
import { toProfileFormValues } from "@/lib/profiles/validation";
import { displayHeading, kicker, shell } from "@/lib/tailwind";

export const metadata: Metadata = {
  title: "Set up your profile",
  description: "Create your public PH Otakus member profile.",
};

export const dynamic = "force-dynamic";

export default async function ProfileSetupPage() {
  const member = await getMember();
  if (!member) redirect("/signin?callbackUrl=%2Fprofile%2Fsetup");
  if (member.user.profile?.profileCompleted) redirect("/profile");

  return (
    <main className="overflow-hidden">
      <section className={`${shell} py-[clamp(65px,9vw,120px)]`}>
        <div className="max-w-[850px]">
          <p className={kicker}><span className="text-brand-red">First step</span> Make your place public</p>
          <h1 className={`${displayHeading} mt-5 text-[clamp(4rem,9vw,9rem)]`}>Create your <em className="font-inherit not-italic text-brand-red">profile.</em></h1>
          <p className="mt-7 max-w-[650px] text-lg">Welcome{member.user.name ? `, ${member.user.name}` : ""}. Choose the name people in the community will know you by. You can fill in the rest whenever you are ready.</p>
          <div className="mt-12"><ProfileForm fallbackAvatar={member.user.image} initial={toProfileFormValues({ username: "", displayName: member.user.name ?? "" })} mode="setup" /></div>
        </div>
      </section>
    </main>
  );
}
