import { prisma } from "@/lib/db/prisma";

const memberUserSelect = {
  id: true,
  name: true,
  image: true,
  createdAt: true,
  profile: {
    select: {
      id: true,
      userId: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      city: true,
      favouriteAnime: true,
      favouriteManga: true,
      favouriteGames: true,
      interests: true,
      creatorType: true,
      profileCompleted: true,
    },
  },
} as const;

export type MemberRecord = Awaited<ReturnType<typeof getMemberById>>;

export async function getMemberById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: memberUserSelect });
}
