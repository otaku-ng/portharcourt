import { EventMediaType, EventStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const eventMediaSelect = {
  id: true,
  url: true,
  objectKey: true,
  alt: true,
  caption: true,
  type: true,
  sortOrder: true,
} satisfies Prisma.EventMediaSelect;

const adminEventSelect = {
  id: true,
  slug: true,
  title: true,
  eyebrow: true,
  description: true,
  content: true,
  registrationUrl: true,
  registrationLabel: true,
  startAt: true,
  endAt: true,
  dateLabel: true,
  timeLabel: true,
  location: true,
  venue: true,
  coverImageUrl: true,
  coverImageKey: true,
  coverImageAlt: true,
  status: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  media: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: eventMediaSelect },
} satisfies Prisma.EventSelect;

export type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  content: string | null;
  registrationUrl: string | null;
  registrationLabel: string | null;
  startAt: Date | null;
  endAt: Date | null;
  dateLabel: string | null;
  timeLabel: string | null;
  location: string;
  venue: string | null;
  coverImageUrl: string;
  coverImageKey: string | null;
  coverImageAlt: string;
  status: EventStatus;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  media: AdminEventMedia[];
};

export type AdminEventMedia = {
  id: string;
  url: string;
  objectKey: string | null;
  alt: string;
  caption: string | null;
  type: EventMediaType;
  sortOrder: number;
};

export type EventWriteData = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  content: string | null;
  registrationUrl: string | null;
  registrationLabel: string | null;
  startAt: Date | null;
  endAt: Date | null;
  dateLabel: string | null;
  timeLabel: string | null;
  location: string;
  venue: string | null;
  coverImageUrl: string;
  coverImageKey: string | null;
  coverImageAlt: string;
  status: EventStatus;
  published: boolean;
};

export type EventMediaWriteData = {
  objectKey: string | null;
  url: string;
  alt: string;
  caption: string | null;
  type: EventMediaType;
  sortOrder: number;
};

export async function getAdminEvents(): Promise<AdminEvent[]> {
  return prisma.event.findMany({
    orderBy: { updatedAt: "desc" },
    select: adminEventSelect,
  });
}

export async function getPublishedEventSitemapEntries(): Promise<Array<{ slug: string; updatedAt: Date }>> {
  return prisma.event.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    select: { slug: true, updatedAt: true },
  });
}

export async function getAdminEventById(id: string): Promise<AdminEvent | null> {
  return prisma.event.findUnique({
    where: { id },
    select: adminEventSelect,
  });
}

export async function createEvent(data: EventWriteData, media: EventMediaWriteData[] = []): Promise<AdminEvent> {
  return prisma.event.create({
    data: {
      ...data,
      media: media.length ? { create: media } : undefined,
    },
    select: adminEventSelect,
  });
}

export async function updateEvent(id: string, data: EventWriteData, media: EventMediaWriteData[]): Promise<AdminEvent> {
  return prisma.$transaction(async (transaction) => {
    await transaction.eventMedia.deleteMany({ where: { eventId: id } });
    return transaction.event.update({
      where: { id },
      data: {
        ...data,
        media: media.length ? { create: media } : undefined,
      },
      select: adminEventSelect,
    });
  });
}

export async function publishEvent(id: string): Promise<AdminEvent> {
  return prisma.event.update({
    where: { id },
    data: { published: true },
    select: adminEventSelect,
  });
}

export async function unpublishEvent(id: string): Promise<AdminEvent> {
  return prisma.event.update({
    where: { id },
    data: { published: false },
    select: adminEventSelect,
  });
}

export function isUniqueSlugError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
