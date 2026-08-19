import { EventStatus, RsvpStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export type RsvpEligibilityEvent = {
  published: boolean;
  status: EventStatus;
  startAt: Date | null;
};

export function isEventRsvpOpen(event: RsvpEligibilityEvent, now = new Date()): boolean {
  return event.published && event.status === EventStatus.UPCOMING && (!event.startAt || event.startAt >= now);
}

export async function getRsvpEligibleEventBySlug(slug: string, now = new Date()) {
  return prisma.event.findFirst({
    where: {
      slug,
      published: true,
      status: EventStatus.UPCOMING,
      OR: [{ startAt: null }, { startAt: { gte: now } }],
    },
    select: { id: true, slug: true, published: true, status: true, startAt: true },
  });
}

export async function getGoingRsvpMembersForEvent(eventId: string) {
  const attendees = await prisma.eventRSVP.findMany({
    where: { eventId, status: RsvpStatus.GOING },
    select: {
      userId: true,
      user: {
        select: {
          profile: { select: { username: true } },
        },
      },
    },
  });

  const uniqueMembers = new Map<string, string | null>();
  for (const attendee of attendees) {
    uniqueMembers.set(attendee.userId, attendee.user.profile?.username ?? null);
  }

  return [...uniqueMembers.entries()].map(([userId, username]) => ({ userId, username }));
}

export async function setEventRsvp(userId: string, eventId: string, status: RsvpStatus) {
  return prisma.eventRSVP.upsert({
    where: { userId_eventId: { userId, eventId } },
    create: { userId, eventId, status },
    update: { status },
  });
}

export async function removeEventRsvp(userId: string, eventId: string) {
  await prisma.eventRSVP.deleteMany({ where: { userId, eventId } });
}
