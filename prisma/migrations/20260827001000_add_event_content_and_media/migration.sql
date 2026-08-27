-- CreateEnum
CREATE TYPE "EventMediaType" AS ENUM ('IMAGE', 'FLYER');

-- AlterTable
ALTER TABLE "Event"
ADD COLUMN "content" TEXT,
ADD COLUMN "registrationLabel" TEXT,
ADD COLUMN "registrationUrl" TEXT;

-- CreateTable
CREATE TABLE "EventMedia" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "objectKey" TEXT,
    "alt" TEXT NOT NULL,
    "caption" TEXT,
    "type" "EventMediaType" NOT NULL DEFAULT 'IMAGE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventMedia_eventId_sortOrder_idx" ON "EventMedia"("eventId", "sortOrder");

-- AddForeignKey
ALTER TABLE "EventMedia" ADD CONSTRAINT "EventMedia_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
