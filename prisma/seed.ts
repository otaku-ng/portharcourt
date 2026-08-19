import { PrismaPg } from "@prisma/adapter-pg";
import { EventStatus, PrismaClient, StoryStatus } from "@prisma/client";

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

const legacyGallery = {
  slug: "scenes-from-the-library",
  title: "Scenes from the library",
  description: "Community, event artwork, collectibles and the visual references that shaped the PH Otakus story.",
  published: true,
  images: [
    { url: "/figma/home-05.jpg", alt: "PH Otakus members cheering together outdoors", caption: "The crew · Community day" },
    { url: "/figma/event-01.jpg", alt: "Vintage comic book covers arranged around Doctor Doom", caption: "Comic culture · Event artwork" },
    { url: "/figma/blog-06.jpg", alt: "A collage wall of anime scenes", caption: "What we watch · Anime archive" },
    { url: "/figma/home-08.jpg", alt: "Kakashi collectible with blue lightning", caption: "Collectors · Shelf stories" },
    { url: "/figma/home-15.jpg", alt: "Colourful vintage comic book covers", caption: "Panels & pages · Manga and comics" },
    { url: "/figma/home-07.jpg", alt: "Vintage illustrated travel poster", caption: "Meetups · Out in Port Harcourt" },
  ],
} as const;

const legacyStories = [
  {
    slug: "october-anime-hype",
    title: "The Hype That October Brings to the Otaku Community",
    category: "Anime",
    coverImageUrl: "/figma/blog-06.jpg",
    coverImageAlt: "A wall of colourful anime scenes from the PH Otakus library",
    excerpt: "A season of returns, discoveries and the conversations that keep the group chat moving.",
    content: "A new season is never only a release calendar. It is a reason for the community to compare notes, trade recommendations and keep the group chat moving.\n\nEvery new show gives us another excuse to gather around a shared story and make it our own.",
  },
  {
    slug: "why-local-community-matters",
    title: "Why Local Community Changes the Way We Enjoy Fandom",
    category: "Community",
    coverImageUrl: "/figma/blog-01.jpg",
    coverImageAlt: "PH Otakus members smiling together after a community gathering",
    excerpt: "The best recommendations are better when they lead to real friendships, shared rooms and loud reactions.",
    content: "The best recommendations are better when they lead to real friendships, shared rooms and loud reactions.\n\nA local community makes fandom tangible. It gives the people behind the usernames a place to meet, collaborate and keep showing up.",
  },
  {
    slug: "collecting-in-ph",
    title: "Collecting in PH: Figures, Posters and the Stories We Keep",
    category: "Culture",
    coverImageUrl: "/figma/home-08.jpg",
    coverImageAlt: "A Kakashi figure posed with blue lightning",
    excerpt: "A quick look at the objects, characters and memories that turn a shelf into a personal archive.",
    content: "A shelf is rarely just a shelf. Figures, posters and little objects carry the stories of where we found them, who introduced us to a character and which season stayed with us.\n\nIn Port Harcourt, collecting is another way of keeping the community archive alive.",
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

  const existingAlbum = await prisma.galleryAlbum.findUnique({ where: { slug: legacyGallery.slug }, select: { id: true } });
  if (!existingAlbum) {
    await prisma.galleryAlbum.create({
      data: {
        slug: legacyGallery.slug,
        title: legacyGallery.title,
        description: legacyGallery.description,
        published: legacyGallery.published,
        images: { create: legacyGallery.images.map((image, sortOrder) => ({ ...image, sortOrder })) },
      },
    });
  }

  for (const story of legacyStories) {
    const existingStory = await prisma.story.findUnique({ where: { slug: story.slug }, select: { id: true } });
    if (!existingStory) {
      await prisma.story.create({
        data: {
          ...story,
          coverImageKey: null,
          status: StoryStatus.PUBLISHED,
          publishedAt: new Date("2024-10-01T00:00:00.000Z"),
        },
      });
    }
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
