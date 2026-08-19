import { EventStatus, Prisma, RsvpStatus } from "@prisma/client";
import { formatEventDate, formatEventTime } from "@/lib/event-data";
import { prisma } from "@/lib/db/prisma";

const memberProfileSelect = {
  username: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  bannerUrl: true,
  city: true,
  favouriteAnime: true,
  favouriteManga: true,
  favouriteGames: true,
  interests: true,
  creatorType: true,
  instagramUrl: true,
  tiktokUrl: true,
  twitterUrl: true,
  youtubeUrl: true,
  twitchUrl: true,
  websiteUrl: true,
  currentlyWatching: true,
  currentlyReading: true,
  currentlyPlaying: true,
  profileCompleted: true,
} satisfies Prisma.ProfileSelect;

const editableProfileSelect = {
  username: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  avatarKey: true,
  bannerUrl: true,
  bannerKey: true,
  city: true,
  favouriteAnime: true,
  favouriteManga: true,
  favouriteGames: true,
  interests: true,
  creatorType: true,
  instagramUrl: true,
  tiktokUrl: true,
  twitterUrl: true,
  youtubeUrl: true,
  twitchUrl: true,
  websiteUrl: true,
  currentlyWatching: true,
  currentlyReading: true,
  currentlyPlaying: true,
  profileCompleted: true,
} satisfies Prisma.ProfileSelect;

const memberUserSelect = {
  image: true,
  createdAt: true,
  profile: { select: memberProfileSelect },
  rsvps: {
    where: {
      status: RsvpStatus.GOING,
      event: { published: true },
    },
    orderBy: { createdAt: "desc" },
    select: {
      event: {
        select: {
          slug: true,
          title: true,
          startAt: true,
          dateLabel: true,
          timeLabel: true,
          location: true,
          venue: true,
          status: true,
        },
      },
    },
  },
  badges: {
    orderBy: { awardedAt: "desc" },
    select: {
      awardedAt: true,
      badge: {
        select: {
          key: true,
          name: true,
          description: true,
          icon: true,
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

type MemberUserRecord = Prisma.UserGetPayload<{ select: typeof memberUserSelect }>;

export type MemberEventActivity = {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string | null;
  upcoming: boolean;
};

export type MemberProfile = {
  joinedAt: Date;
  image: string | null;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  city: string | null;
  favouriteAnime: string | null;
  favouriteManga: string | null;
  favouriteGames: string | null;
  interests: string[];
  creatorType: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  twitchUrl: string | null;
  websiteUrl: string | null;
  currentlyWatching: string | null;
  currentlyReading: string | null;
  currentlyPlaying: string | null;
  events: MemberEventActivity[];
  badges: Array<{
    key: string;
    name: string;
    description: string;
    icon: string;
    awardedAt: Date;
  }>;
};

function toMemberProfile(user: MemberUserRecord): MemberProfile | null {
  if (!user.profile) return null;

  const now = new Date();
  const events = user.rsvps
    .map(({ event }) => {
      const upcoming = event.status === EventStatus.UPCOMING && (!event.startAt || event.startAt >= now);
      return {
        slug: event.slug,
        title: event.title,
        date: formatEventDate(event.startAt, event.dateLabel),
        time: formatEventTime(event.startAt, event.timeLabel),
        location: event.location,
        venue: event.venue,
        upcoming,
        startAt: event.startAt,
      };
    })
    .sort((left, right) => {
      if (left.upcoming !== right.upcoming) return left.upcoming ? -1 : 1;
      if (!left.startAt && !right.startAt) return 0;
      if (!left.startAt) return 1;
      if (!right.startAt) return -1;
      return right.startAt.getTime() - left.startAt.getTime();
    })
    .map((event) => ({
      slug: event.slug,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      venue: event.venue,
      upcoming: event.upcoming,
    }));

  return {
    joinedAt: user.createdAt,
    image: user.image,
    username: user.profile.username,
    displayName: user.profile.displayName,
    bio: user.profile.bio,
    avatarUrl: user.profile.avatarUrl,
    bannerUrl: user.profile.bannerUrl,
    city: user.profile.city,
    favouriteAnime: user.profile.favouriteAnime,
    favouriteManga: user.profile.favouriteManga,
    favouriteGames: user.profile.favouriteGames,
    interests: user.profile.interests,
    creatorType: user.profile.creatorType,
    instagramUrl: user.profile.instagramUrl,
    tiktokUrl: user.profile.tiktokUrl,
    twitterUrl: user.profile.twitterUrl,
    youtubeUrl: user.profile.youtubeUrl,
    twitchUrl: user.profile.twitchUrl,
    websiteUrl: user.profile.websiteUrl,
    currentlyWatching: user.profile.currentlyWatching,
    currentlyReading: user.profile.currentlyReading,
    currentlyPlaying: user.profile.currentlyPlaying,
    events,
    badges: user.badges.map(({ awardedAt, badge }) => ({ ...badge, awardedAt })),
  };
}

export async function getMemberProfileByUserId(userId: string): Promise<MemberProfile | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: memberUserSelect });
  return user ? toMemberProfile(user) : null;
}

export async function getMemberProfileByUsername(username: string): Promise<MemberProfile | null> {
  const user = await prisma.user.findFirst({
    where: { profile: { is: { username: username.trim().toLowerCase() } } },
    select: memberUserSelect,
  });
  return user ? toMemberProfile(user) : null;
}

export async function getEditableProfileByUserId(userId: string) {
  return prisma.profile.findUnique({ where: { userId }, select: editableProfileSelect });
}

export async function updateProfile(userId: string, data: {
  username: string;
  displayName: string;
  bio: string | null;
  city: string | null;
  interests: string[];
  favouriteAnime: string | null;
  favouriteManga: string | null;
  favouriteGames: string | null;
  creatorType: string | null;
  avatarUrl: string | null;
  avatarKey: string | null;
  bannerUrl: string | null;
  bannerKey: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  twitchUrl: string | null;
  websiteUrl: string | null;
  currentlyWatching: string | null;
  currentlyReading: string | null;
  currentlyPlaying: string | null;
}) {
  return prisma.profile.upsert({
    where: { userId },
    create: { userId, ...data, profileCompleted: true },
    update: { ...data, profileCompleted: true },
    select: memberProfileSelect,
  });
}

export function isUniqueUsernameError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
