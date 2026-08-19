-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEMBER', 'ADMIN', 'SUPER_ADMIN');

-- Existing users intentionally default to the least-privileged role.
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'MEMBER';

ALTER TABLE "Profile"
    ADD COLUMN "avatarKey" TEXT,
    ADD COLUMN "bannerUrl" TEXT,
    ADD COLUMN "bannerKey" TEXT,
    ADD COLUMN "instagramUrl" TEXT,
    ADD COLUMN "tiktokUrl" TEXT,
    ADD COLUMN "twitterUrl" TEXT,
    ADD COLUMN "youtubeUrl" TEXT,
    ADD COLUMN "twitchUrl" TEXT,
    ADD COLUMN "websiteUrl" TEXT,
    ADD COLUMN "currentlyWatching" TEXT,
    ADD COLUMN "currentlyReading" TEXT,
    ADD COLUMN "currentlyPlaying" TEXT;
