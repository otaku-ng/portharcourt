import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const title = "PH Otakus — Port Harcourt's Otaku Community";
const description = "Anime, manga, gaming, cosplay, events and community stories from Port Harcourt, Nigeria.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: { default: title, template: "%s — PH Otakus" },
    description,
    icons: {
      icon: [
        { url: "/figma/ph-otakus-logo-primary.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
        { url: "/figma/ph-otakus-logo-inverse.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      ],
    },
    keywords: ["PH Otakus", "Port Harcourt anime", "Nigeria cosplay", "gaming community", "manga"],
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/figma/home-05.jpg", width: 1080, height: 810, alt: "PH Otakus community members in Port Harcourt" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/figma/home-05.jpg"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#00AEEF",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-brand-paper font-body text-brand-ink antialiased max-[560px]:text-[15px]">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
