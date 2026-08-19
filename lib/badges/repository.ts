import { prisma } from "@/lib/db/prisma";

export async function getBadgeDefinitions(keys?: string[]) {
  return prisma.badge.findMany({
    where: keys ? { key: { in: keys } } : undefined,
    orderBy: { createdAt: "asc" },
  });
}

export async function awardBadge(userId: string, badgeId: string) {
  return prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId } },
    create: { userId, badgeId },
    update: {},
  });
}
