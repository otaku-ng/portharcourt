import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;

  return (
    <main className="min-h-[calc(100svh-80px)] bg-brand-paper-dark">
      <section className="mx-auto grid w-[min(1180px,calc(100vw-64px))] items-center py-[clamp(90px,15vw,180px)] max-[820px]:w-[calc(100vw_-_32px)]">
        <div>
          <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase hover:text-brand-red" href="/">← Back to public site</Link>
          <p className="mt-16 text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">PH Otakus / Content desk</p>
          <h1 className="mt-5 max-w-[720px] font-display text-[clamp(4rem,9vw,8.4rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">Sign in to manage events.</h1>
          <p className="mt-7 max-w-[460px] text-brand-ink-soft">This is a temporary admin gate for event publishing. Public community accounts are not part of this phase.</p>
          <AdminLoginForm nextPath={params.next} />
        </div>
      </section>
    </main>
  );
}
