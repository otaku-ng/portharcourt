import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  if (!(await requireAdmin())) redirect("/admin/login");

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
            </nav>
          </div>
          <form action={logoutAction}>
            <button className="border-b-2 border-current pb-1 text-[0.72rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" type="submit">Log out</button>
          </form>
        </div>
        {children}
      </div>
    </main>
  );
}
