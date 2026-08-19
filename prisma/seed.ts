import { PrismaPg } from "@prisma/adapter-pg";
import { EventStatus, PrismaClient } from "@prisma/client";

const adapter = new PrismaPg(process.env.DATABASE_URL ?? "postgresql://localhost:5432/ph_otakus");
const prisma = new PrismaClient({ adapter });

const events = [
  {
    slug: "otaku-ph-city-hangout",
    title: "Otaku PH City Casual Hangout",
    eyebrow: "Community meetup",
    description:
      "A relaxed day for anime fans, gamers, manga readers and cosplayers to meet, trade recommendations and enjoy the city together.",
    startAt: new Date("2022-09-17T10:00:00.000Z"),
    endAt: null,
    dateLabel: null,
    timeLabel: "10:00 AM",
    location: "Port Harcourt",
    venue: "Pleasure Park",
    coverImageUrl: "/figma/event-01.jpg",
    coverImageAlt: "Colourful vintage comic-book covers used in the PH Otakus event design",
    status: EventStatus.ARCHIVED,
    published: true,
  },
  {
    slug: "nerd-work-comic-con",
    title: "Nerd Work Comic Con",
    eyebrow: "Convention",
    description:
      "A celebration of comics, games, cosplay and the creators building fandom culture in Port Harcourt.",
    startAt: null,
    endAt: null,
    dateLabel: "2022 archive",
    timeLabel: "All day",
    location: "Port Harcourt",
    venue: null,
    coverImageUrl: "/figma/home-07.jpg",
    coverImageAlt: "Vintage illustrated event poster from the PH Otakus design library",
    status: EventStatus.ARCHIVED,
    published: true,
  },
  {
    slug: "next-community-session",
    title: "The Next Community Session",
    eyebrow: "Announcements soon",
    description:
      "Watch this space for the next hangout, watch party or tournament from the PH Otakus crew.",
    startAt: null,
    endAt: null,
    dateLabel: "Date to be announced",
    timeLabel: "Follow the community",
    location: "Port Harcourt",
    venue: null,
    coverImageUrl: "/figma/home-08.jpg",
    coverImageAlt: "Kakashi collectible photographed against a dark background",
    status: EventStatus.UPCOMING,
    published: true,
  },
] as const;

async function main() {
  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: event,
      create: event,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
