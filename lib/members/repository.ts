import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { CREATOR_TYPE_OPTIONS, INTEREST_OPTIONS } from "@/lib/profiles/validation";

const publicMemberSelect = {
  username: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  city: true,
  interests: true,
  creatorType: true,
  user: {
    select: {
      image: true,
      createdAt: true,
    },
  },
} satisfies Prisma.ProfileSelect;

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

type PublicMemberRecord = Prisma.ProfileGetPayload<{ select: typeof publicMemberSelect }>;

export type MemberInterest = (typeof INTEREST_OPTIONS)[number];
export type MemberCreatorFilter = (typeof CREATOR_TYPE_OPTIONS)[number] | "all";

export type PublicMember = {
  username: string;
  displayName: string;
  bio: string | null;
  image: string | null;
  city: string | null;
  interests: string[];
  creatorType: string | null;
  joinedAt: Date;
};

export type GetPublicMembersOptions = {
  q?: string;
  interest?: MemberInterest;
  creator?: MemberCreatorFilter;
  page?: number;
  pageSize?: number;
};

export type PublicMembersResult = {
  members: PublicMember[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type MemberRecord = Awaited<ReturnType<typeof getMemberById>>;

export async function getMemberById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: memberUserSelect });
}

function buildWhere({ q, interest, creator }: GetPublicMembersOptions): Prisma.ProfileWhereInput {
  const search = q?.trim();
  const filters: Prisma.ProfileWhereInput[] = [{ profileCompleted: true }];

  if (search) {
    filters.push({
      OR: [
        { username: { contains: search, mode: "insensitive" } },
        { displayName: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (interest) filters.push({ interests: { has: interest } });

  if (creator === "all") {
    filters.push({ creatorType: { not: null } });
  } else if (creator) {
    filters.push({ creatorType: creator });
  }

  return { AND: filters };
}

function toPublicMember(profile: PublicMemberRecord): PublicMember {
  return {
    username: profile.username,
    displayName: profile.displayName,
    bio: profile.bio,
    image: profile.avatarUrl ?? profile.user.image,
    city: profile.city,
    interests: profile.interests,
    creatorType: profile.creatorType,
    joinedAt: profile.user.createdAt,
  };
}

export async function getPublicMembers(options: GetPublicMembersOptions = {}): Promise<PublicMembersResult> {
  const pageSize = Number.isFinite(options.pageSize) && options.pageSize && options.pageSize > 0
    ? Math.min(Math.floor(options.pageSize), 100)
    : 24;
  const requestedPage = Number.isFinite(options.page) && options.page && options.page > 0
    ? Math.floor(options.page)
    : 1;
  const where = buildWhere(options);
  const totalCount = await prisma.profile.count({ where });
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;
  const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

  const matchingProfiles = await prisma.profile.findMany({
    where,
    orderBy: { user: { createdAt: "desc" } },
    select: publicMemberSelect,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    members: matchingProfiles.map(toPublicMember),
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}
