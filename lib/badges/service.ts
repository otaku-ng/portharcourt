import { RsvpStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { awardBadge, getBadgeDefinitions } from "@/lib/badges/repository";

const AUTOMATIC_BADGE_KEYS = ["FIRST_EVENT", "FIVE_EVENTS"] as const;

export async function evaluateBadgesForUser(userId: string): Promise<string[]> {
  const pastGoingCount = await prisma.eventRSVP.count({
    where: {
      userId,
      status: RsvpStatus.GOING,
      event: {
        published: true,
        startAt: { lt: new Date() },
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
