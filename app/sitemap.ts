import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getPublishedEventSitemapEntries } from "@/lib/events/repository";
import { getPublishedGalleryAlbumSitemapEntries } from "@/lib/gallery/repository";
import { getPublicMemberSitemapEntries } from "@/lib/members/repository";
import { getPublishedStorySitemapEntries } from "@/lib/stories/repository";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: getSiteUrl(), changeFrequency: "weekly", priority: 1 },
  { url: getSiteUrl("events"), changeFrequency: "weekly", priority: 0.8 },
  { url: getSiteUrl("gallery"), changeFrequency: "weekly", priority: 0.7 },
  { url: getSiteUrl("blog"), changeFrequency: "weekly", priority: 0.7 },
  { url: getSiteUrl("community"), changeFrequency: "monthly", priority: 0.7 },
  { url: getSiteUrl("community/members"), changeFrequency: "daily", priority: 0.7 },
  { url: getSiteUrl("contact"), changeFrequency: "monthly", priority: 0.5 },
];

// The sitemap reads live PostgreSQL content and must be generated at request time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, stories, albums, members] = await Promise.all([
    getPublishedEventSitemapEntries(),
    getPublishedStorySitemapEntries(),
    getPublishedGalleryAlbumSitemapEntries(),
    getPublicMemberSitemapEntries(),
  ]);

  return [
    ...staticRoutes,
    ...events.map((event) => ({
      url: getSiteUrl(`events/${event.slug}`),
      lastModified: event.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...stories.map((story) => ({
      url: getSiteUrl(`blog/${story.slug}`),
      lastModified: story.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...albums.map((album) => ({
      url: getSiteUrl(`gallery/${album.slug}`),
      lastModified: album.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...members.map((member) => ({
      url: getSiteUrl(`members/${member.username}`),
      lastModified: member.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
