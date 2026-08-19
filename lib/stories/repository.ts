import { Prisma, StoryStatus } from "@prisma/client";
import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import type { AdminStory, PublicStory, StorySummary } from "@/lib/stories/types";

const adminStorySelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  content: true,
  category: true,
  coverImageUrl: true,
  coverImageKey: true,
  coverImageAlt: true,
  status: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.StorySelect;

type AdminStoryRecord = Prisma.StoryGetPayload<{ select: typeof adminStorySelect }>;

const publicStorySelect = {
  slug: true,
  title: true,
  excerpt: true,
  content: true,
  category: true,
  coverImageUrl: true,
  coverImageAlt: true,
  publishedAt: true,
} satisfies Prisma.StorySelect;

type PublicStoryRecord = Prisma.StoryGetPayload<{ select: typeof publicStorySelect }>;

export type StoryWriteData = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl: string;
  coverImageKey: string | null;
  coverImageAlt: string;
  status: StoryStatus;
  publishedAt: Date | null;
};

function formatStoryDate(publishedAt: Date | null): string {
  return publishedAt
    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(publishedAt)
    : "Community notes";
}

function mapAdminStory(story: AdminStoryRecord): AdminStory {
  return story;
}

function mapPublicStory(story: PublicStoryRecord): PublicStory {
  return {
    slug: story.slug,
    title: story.title,
    category: story.category,
    date: formatStoryDate(story.publishedAt),
    image: story.coverImageUrl,
    alt: story.coverImageAlt,
    excerpt: story.excerpt,
    content: story.content,
    publishedAt: story.publishedAt,
  };
}

export async function getAdminStories(): Promise<AdminStory[]> {
  const stories = await prisma.story.findMany({ orderBy: { updatedAt: "desc" }, select: adminStorySelect });
  return stories.map(mapAdminStory);
}

export async function getAdminStoryById(id: string): Promise<AdminStory | null> {
  const story = await prisma.story.findUnique({ where: { id }, select: adminStorySelect });
  return story ? mapAdminStory(story) : null;
}

export async function createStory(data: StoryWriteData): Promise<AdminStory> {
  const story = await prisma.story.create({ data, select: adminStorySelect });
  return mapAdminStory(story);
}

export async function updateStory(id: string, data: StoryWriteData): Promise<AdminStory> {
  const story = await prisma.story.update({ where: { id }, data, select: adminStorySelect });
  return mapAdminStory(story);
}

export async function setStoryPublished(id: string, published: boolean): Promise<AdminStory> {
  const story = await prisma.story.update({
    where: { id },
    data: {
      status: published ? StoryStatus.PUBLISHED : StoryStatus.DRAFT,
      publishedAt: published ? new Date() : null,
    },
    select: adminStorySelect,
  });
  return mapAdminStory(story);
}

export async function getPublishedStories(): Promise<PublicStory[]> {
  const stories = await prisma.story.findMany({
    where: { status: StoryStatus.PUBLISHED },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: publicStorySelect,
  });
  return stories.map(mapPublicStory);
}

export async function getPublishedStorySummaries(limit = 3): Promise<StorySummary[]> {
  const stories = await getPublishedStories();
  return stories.slice(0, limit).map((story) => ({
    slug: story.slug,
    title: story.title,
    category: story.category,
    date: story.date,
    image: story.image,
    alt: story.alt,
    excerpt: story.excerpt,
  }));
}

export const getPublishedStoryBySlug = cache(async (slug: string): Promise<PublicStory | null> => {
  const story = await prisma.story.findFirst({
    where: { slug, status: StoryStatus.PUBLISHED },
    select: publicStorySelect,
  });
  return story ? mapPublicStory(story) : null;
});

export function isUniqueStorySlugError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
