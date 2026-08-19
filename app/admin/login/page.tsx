import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = typeof params.next === "string" && params.next.startsWith("/admin/") && !params.next.startsWith("//") ? params.next : "/admin";
  redirect(`/signin?callbackUrl=${encodeURIComponent(next)}`);
}
