import { RsvpStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function getPublishedEventForRsvp(slug: string) {
  return prisma.event.findFirst({
    where: { slug, published: true },
    select: { id: true, slug: true },
  });
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
