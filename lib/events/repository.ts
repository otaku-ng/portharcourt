import { EventStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const adminEventSelect = {
  id: true,
  slug: true,
  title: true,
  eyebrow: true,
  description: true,
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
} satisfies Prisma.EventSelect;

export type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
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
};

export type EventWriteData = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
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

export async function getAdminEvents(): Promise<AdminEvent[]> {
  return prisma.event.findMany({
    orderBy: { updatedAt: "desc" },
    select: adminEventSelect,
  });
}

export async function getAdminEventById(id: string): Promise<AdminEvent | null> {
  return prisma.event.findUnique({
    where: { id },
    select: adminEventSelect,
  });
}

export async function createEvent(data: EventWriteData): Promise<AdminEvent> {
  return prisma.event.create({
    data,
    select: adminEventSelect,
  });
}

export async function updateEvent(id: string, data: EventWriteData): Promise<AdminEvent> {
  return prisma.event.update({
    where: { id },
    data,
    select: adminEventSelect,
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
