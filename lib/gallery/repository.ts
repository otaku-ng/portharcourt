import { Prisma } from "@prisma/client";
import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import type {
  AdminGalleryAlbum,
  GalleryAlbumSummary,
  GalleryEventOption,
  GalleryImageData,
  PublicGalleryAlbum,
} from "@/lib/gallery/types";

const imageSelect = {
  id: true,
  url: true,
  objectKey: true,
  alt: true,
  caption: true,
  sortOrder: true,
} satisfies Prisma.GalleryImageSelect;

const eventSelect = {
  id: true,
  title: true,
  slug: true,
  published: true,
} satisfies Prisma.EventSelect;

const adminAlbumSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  eventId: true,
  date: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  event: { select: eventSelect },
  images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: imageSelect },
  _count: { select: { images: true } },
} satisfies Prisma.GalleryAlbumSelect;

type AdminAlbumRecord = Prisma.GalleryAlbumGetPayload<{ select: typeof adminAlbumSelect }>;

const publicAlbumSelect = {
  slug: true,
  title: true,
  description: true,
  date: true,
  event: { select: { slug: true, title: true, published: true } },
  images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: imageSelect },
} satisfies Prisma.GalleryAlbumSelect;

type PublicAlbumRecord = Prisma.GalleryAlbumGetPayload<{ select: typeof publicAlbumSelect }>;

export type GalleryAlbumWriteData = {
  slug: string;
  title: string;
  description: string | null;
  eventId: string | null;
  date: Date | null;
  published: boolean;
};

export type GalleryImageWriteData = {
  objectKey: string | null;
  url: string;
  alt: string;
  caption: string | null;
  sortOrder: number;
};

function mapImages(images: Array<{
  id: string;
  url: string;
  objectKey: string | null;
  alt: string;
  caption: string | null;
  sortOrder: number;
}>): GalleryImageData[] {
  return images.map((image) => ({
    id: image.id,
    url: image.url,
    objectKey: image.objectKey,
    alt: image.alt,
    caption: image.caption,
    sortOrder: image.sortOrder,
  }));
}

function mapAdminAlbum(album: AdminAlbumRecord): AdminGalleryAlbum {
  return {
    id: album.id,
    slug: album.slug,
    title: album.title,
    description: album.description,
    eventId: album.eventId,
    date: album.date,
    published: album.published,
    imageCount: album._count.images,
    event: album.event,
    images: mapImages(album.images),
    createdAt: album.createdAt,
    updatedAt: album.updatedAt,
  };
}

function mapPublicAlbum(album: PublicAlbumRecord): PublicGalleryAlbum {
  return {
    slug: album.slug,
    title: album.title,
    description: album.description,
    date: album.date,
    event: album.event?.published ? { slug: album.event.slug, title: album.event.title } : null,
    images: mapImages(album.images),
  };
}

export async function getAdminGalleryAlbums(): Promise<GalleryAlbumSummary[]> {
  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      date: true,
      published: true,
      updatedAt: true,
      event: { select: eventSelect },
      _count: { select: { images: true } },
    },
  });

  return albums.map((album) => ({
    ...album,
    imageCount: album._count.images,
  }));
}

export async function getAdminGalleryAlbumById(id: string): Promise<AdminGalleryAlbum | null> {
  const album = await prisma.galleryAlbum.findUnique({ where: { id }, select: adminAlbumSelect });
  return album ? mapAdminAlbum(album) : null;
}

export async function getGalleryEventOptions(): Promise<GalleryEventOption[]> {
  return prisma.event.findMany({
    orderBy: [{ startAt: { sort: "desc", nulls: "last" } }, { title: "asc" }],
    select: { id: true, title: true, slug: true },
  });
}

export async function galleryEventExists(id: string): Promise<boolean> {
  const event = await prisma.event.findUnique({ where: { id }, select: { id: true } });
  return Boolean(event);
}

export async function createGalleryAlbum(
  data: GalleryAlbumWriteData,
  images: GalleryImageWriteData[] = [],
): Promise<AdminGalleryAlbum> {
  const album = await prisma.galleryAlbum.create({
    data: {
      ...data,
      images: images.length ? { create: images } : undefined,
    },
    select: adminAlbumSelect,
  });

  return mapAdminAlbum(album);
}

export async function updateGalleryAlbum(
  id: string,
  data: GalleryAlbumWriteData,
  images: GalleryImageWriteData[],
): Promise<AdminGalleryAlbum> {
  const album = await prisma.$transaction(async (transaction) => {
    await transaction.galleryImage.deleteMany({ where: { albumId: id } });
    return transaction.galleryAlbum.update({
      where: { id },
      data: {
        ...data,
        images: images.length ? { create: images } : undefined,
      },
      select: adminAlbumSelect,
    });
  });

  return mapAdminAlbum(album);
}

export async function setGalleryAlbumPublished(id: string, published: boolean): Promise<AdminGalleryAlbum> {
  const album = await prisma.galleryAlbum.update({
    where: { id },
    data: { published },
    select: adminAlbumSelect,
  });

  return mapAdminAlbum(album);
}

export async function getPublishedGalleryAlbums(): Promise<PublicGalleryAlbum[]> {
  const albums = await prisma.galleryAlbum.findMany({
    where: { published: true },
    orderBy: [{ date: { sort: "desc", nulls: "last" } }, { updatedAt: "desc" }],
    select: publicAlbumSelect,
  });

  return albums.map(mapPublicAlbum);
}

export const getPublishedGalleryAlbumBySlug = cache(async (slug: string): Promise<PublicGalleryAlbum | null> => {
  const album = await prisma.galleryAlbum.findFirst({
    where: { slug, published: true },
    select: publicAlbumSelect,
  });

  return album ? mapPublicAlbum(album) : null;
});

export async function getPublishedGalleryImages(limit = 6): Promise<Array<GalleryImageData & { albumSlug: string; albumTitle: string }>> {
  const images = await prisma.galleryImage.findMany({
    where: { album: { published: true } },
    orderBy: [{ album: { updatedAt: "desc" } }, { sortOrder: "asc" }, { createdAt: "asc" }],
    take: limit,
    select: {
      ...imageSelect,
      album: { select: { slug: true, title: true } },
    },
  });

  return images.map((image) => ({
    ...image,
    albumSlug: image.album.slug,
    albumTitle: image.album.title,
  }));
}

export function isUniqueGallerySlugError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
