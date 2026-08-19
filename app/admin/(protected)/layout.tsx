import Link from "next/link";
import type { ReactNode } from "react";
import { memberSignOutAction } from "@/lib/auth/member-actions";
import { adminRoleLabel, requireAdmin } from "@/lib/auth/admin";
import { MemberAvatar } from "@/components/member-avatar";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin("/admin");

  if (!admin) {
    return (
      <main className="min-h-[calc(100svh-80px)] bg-brand-paper-dark">
        <div className="mx-auto w-[min(900px,calc(100vw-64px))] py-[clamp(90px,14vw,180px)] max-[820px]:w-[calc(100vw_-_32px)]">
          <p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">PH Otakus / Admin</p>
          <h1 className="mt-5 max-w-[760px] font-display text-[clamp(3.8rem,9vw,8rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">This room is for the admin team.</h1>
          <p className="mt-7 max-w-[560px] text-lg text-brand-ink-soft">Your member account is signed in, but it does not have CMS access. Ask a super admin to update your role.</p>
          <Link className="mt-8 inline-flex min-h-12 items-center bg-brand-ink px-5 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase hover:bg-brand-blue hover:text-brand-ink" href="/profile">Back to profile <span className="ml-6">↗</span></Link>
        </div>
      </main>
    );
  }

  const identityName = admin.profile?.displayName ?? admin.name ?? admin.email ?? "Administrator";
  const identityImage = admin.profile?.avatarUrl ?? admin.image;

  return (
    <main className="min-h-[calc(100svh-80px)] bg-brand-paper-dark">
      <div className="mx-auto w-[min(1180px,calc(100vw-64px))] py-12 max-[820px]:w-[calc(100vw_-_32px)] max-[820px]:py-8">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5 border-b border-[var(--line)] pb-5">
          <div>
            <p className="text-[0.68rem] font-black tracking-[0.15em] text-brand-red uppercase">PH Otakus / Admin</p>
            <nav className="mt-3 flex gap-5 text-[0.78rem] font-black tracking-[0.08em] uppercase">
              <Link className="hover:text-brand-red" href="/admin/events">Events</Link>
              <Link className="hover:text-brand-red" href="/admin/gallery">Gallery</Link>
              <Link className="hover:text-brand-red" href="/admin/stories">Stories</Link>
              <Link className="hover:text-brand-red" href="/admin/newsletter">Newsletter</Link>
              {admin.role === "SUPER_ADMIN" ? <Link className="hover:text-brand-red" href="/admin/admins">Admins</Link> : null}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <MemberAvatar name={identityName} image={identityImage} size="small" />
              <div>
                <p className="max-w-[180px] truncate text-sm font-black">{identityName}</p>
                <p className="mt-1 text-[0.62rem] font-black tracking-[0.12em] text-brand-red uppercase">{adminRoleLabel(admin.role)}</p>
              </div>
            </div>
            <form action={memberSignOutAction}>
              <button className="border-b-2 border-current pb-1 text-[0.72rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" type="submit">Log out</button>
            </form>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
