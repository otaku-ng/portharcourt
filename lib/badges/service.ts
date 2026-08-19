import { EventStatus, RsvpStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { awardBadge, getBadgeDefinitions } from "@/lib/badges/repository";
import { getGoingRsvpMembersForEvent } from "@/lib/rsvp/repository";

const AUTOMATIC_BADGE_KEYS = ["FIRST_EVENT", "FIVE_EVENTS"] as const;

export async function evaluateBadgesForUser(userId: string): Promise<string[]> {
  const pastGoingCount = await prisma.eventRSVP.count({
    where: {
      userId,
      status: RsvpStatus.GOING,
      event: {
        published: true,
        status: EventStatus.ARCHIVED,
      },
    },
  });

  const qualifyingKeys = [
    ...(pastGoingCount >= 1 ? ["FIRST_EVENT"] : []),
    ...(pastGoingCount >= 5 ? ["FIVE_EVENTS"] : []),
  ];
  if (qualifyingKeys.length === 0) return [];

  const definitions = await getBadgeDefinitions([...AUTOMATIC_BADGE_KEYS]);
  const definitionsByKey = new Map(definitions.map((badge) => [badge.key, badge]));
  const awarded: string[] = [];

  for (const key of qualifyingKeys) {
    const definition = definitionsByKey.get(key);
    if (!definition) continue;
    await awardBadge(userId, definition.id);
    awarded.push(key);
  }

  return awarded;
}

/**
 * MVP attendance semantics: a GOING RSVP on a published event after its
 * UPCOMING → ARCHIVED transition is treated as attendance. A future check-in
 * model can replace this rule without changing the badge definitions.
 */
export async function evaluateBadgesForCompletedEvent(eventId: string) {
  const members = await getGoingRsvpMembersForEvent(eventId);
  const evaluatedMembers: typeof members = [];

  for (const member of members) {
    try {
      await evaluateBadgesForUser(member.userId);
    } catch (error) {
      console.error("[badges] Could not evaluate completed-event badges", {
        eventId,
        userId: member.userId,
        error: error instanceof Error ? { name: error.name, message: error.message } : { message: "Unknown error" },
      });
    }
    evaluatedMembers.push(member);
  }

  return evaluatedMembers;
}
