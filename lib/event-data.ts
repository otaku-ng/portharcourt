import { Prisma, EventStatus, RsvpStatus } from "@prisma/client";
import { cache } from "react";
import { prisma } from "@/lib/db/prisma";

export type PublicEvent = {
  slug: string;
  title: string;
  eyebrow: string;
  date: string;
  time: string;
  location: string;
  venue: string | null;
  displayLocation: string;
  image: string;
  alt: string;
  description: string;
  status: "Next up" | "Archive";
};

export type PublicEventDetails = PublicEvent & {
  goingCount: number;
  interestedCount: number;
  currentUserRsvp: RsvpStatus | null;
};

const publicEventSelect = {
  slug: true,
  title: true,
  eyebrow: true,
  description: true,
  startAt: true,
  dateLabel: true,
  timeLabel: true,
  location: true,
  venue: true,
  coverImageUrl: true,
  coverImageAlt: true,
  status: true,
} satisfies Prisma.EventSelect;

const publicEventDetailsSelect = {
  ...publicEventSelect,
  id: true,
} satisfies Prisma.EventSelect;

type PublicEventRecord = Prisma.EventGetPayload<{
  select: typeof publicEventSelect;
}>;

type PublicEventDetailsRecord = Prisma.EventGetPayload<{
  select: typeof publicEventDetailsSelect;
}>;

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

export function formatEventDate(startAt: Date | null, dateLabel: string | null): string {
  return dateLabel ?? (startAt ? dateFormatter.format(startAt) : "Date to be announced");
}

export function formatEventTime(startAt: Date | null, timeLabel: string | null): string {
  return timeLabel ?? (startAt ? timeFormatter.format(startAt) : "Follow the community");
}

function toPublicEvent(event: PublicEventRecord): PublicEvent {
  const displayLocation = [event.venue, event.location].filter(Boolean).join(", ");

  return {
    slug: event.slug,
    title: event.title,
    eyebrow: event.eyebrow,
    date: formatEventDate(event.startAt, event.dateLabel),
    time: formatEventTime(event.startAt, event.timeLabel),
    location: event.location,
    venue: event.venue,
    displayLocation,
    image: event.coverImageUrl,
    alt: event.coverImageAlt,
    description: event.description,
    status: event.status === EventStatus.ARCHIVED ? "Archive" : "Next up",
  };
}

function toPublicEventDetails(
  event: PublicEventDetailsRecord,
  rsvpCounts: Array<{ status: RsvpStatus; _count: { _all: number } }>,
  currentUserRsvp: RsvpStatus | null,
): PublicEventDetails {
  const base = toPublicEvent(event);
  const goingCount = rsvpCounts.find((count) => count.status === RsvpStatus.GOING)?._count._all ?? 0;
  const interestedCount = rsvpCounts.find((count) => count.status === RsvpStatus.INTERESTED)?._count._all ?? 0;

  return {
    ...base,
    goingCount,
    interestedCount,
    currentUserRsvp,
  };
}

export async function getPublishedEvents(): Promise<PublicEvent[]> {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: [{ createdAt: "desc" }],
    select: publicEventSelect,
  });

  return events.map(toPublicEvent);
}

export async function getUpcomingEvents(): Promise<PublicEvent[]> {
  const events = await prisma.event.findMany({
    where: { published: true, status: EventStatus.UPCOMING },
    orderBy: [
      { startAt: { sort: "asc", nulls: "last" } },
      { createdAt: "desc" },
    ],
    select: publicEventSelect,
  });

  return events.map(toPublicEvent);
}

export async function getArchivedEvents(): Promise<PublicEvent[]> {
  const events = await prisma.event.findMany({
    where: { published: true, status: EventStatus.ARCHIVED },
    orderBy: [
      { startAt: { sort: "desc", nulls: "last" } },
      { updatedAt: "desc" },
    ],
    select: publicEventSelect,
  });

  return events.map(toPublicEvent);
}

export const getEventBySlug = cache(async (slug: string): Promise<PublicEvent | null> => {
  const event = await prisma.event.findFirst({
    where: { slug, published: true },
    select: publicEventSelect,
  });

  return event ? toPublicEvent(event) : null;
});

export async function getPublishedEventDetailsBySlug(slug: string, userId?: string): Promise<PublicEventDetails | null> {
  const event = await prisma.event.findFirst({
    where: { slug, published: true },
    select: publicEventDetailsSelect,
  });

  if (!event) return null;

  const [rsvpCounts, currentUserRsvp] = await Promise.all([
    prisma.eventRSVP.groupBy({
      by: ["status"],
      where: { eventId: event.id },
      _count: { _all: true },
    }),
    userId
      ? prisma.eventRSVP.findUnique({
          where: { userId_eventId: { userId, eventId: event.id } },
          select: { status: true },
        })
      : Promise.resolve(null),
  ]);

  return toPublicEventDetails(event, rsvpCounts, currentUserRsvp?.status ?? null);
}
