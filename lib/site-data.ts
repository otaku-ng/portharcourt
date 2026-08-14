export type EventItem = {
  slug: string;
  title: string;
  eyebrow: string;
  date: string;
  time: string;
  location: string;
  image: string;
  alt: string;
  description: string;
  status: "Next up" | "Archive";
};

export type StoryItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  alt: string;
  excerpt: string;
};

export const navigation = [
  { href: "/events", label: "Events" },
  { href: "/community", label: "Community" },
  { href: "/blog", label: "Stories" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const events: EventItem[] = [
  {
    slug: "otaku-ph-city-hangout",
    title: "Otaku PH City Casual Hangout",
    eyebrow: "Community meetup",
    date: "17 September 2022",
    time: "10:00 AM",
    location: "Pleasure Park, Port Harcourt",
    image: "/figma/event-01.jpg",
    alt: "Colourful vintage comic-book covers used in the PH Otakus event design",
    description:
      "A relaxed day for anime fans, gamers, manga readers and cosplayers to meet, trade recommendations and enjoy the city together.",
    status: "Archive",
  },
  {
    slug: "nerd-work-comic-con",
    title: "Nerd Work Comic Con",
    eyebrow: "Convention",
    date: "2022 archive",
    time: "All day",
    location: "Port Harcourt",
    image: "/figma/home-07.jpg",
    alt: "Vintage illustrated event poster from the PH Otakus design library",
    description:
      "A celebration of comics, games, cosplay and the creators building fandom culture in Port Harcourt.",
    status: "Archive",
  },
  {
    slug: "next-community-session",
    title: "The Next Community Session",
    eyebrow: "Announcements soon",
    date: "Date to be announced",
    time: "Follow the community",
    location: "Port Harcourt",
    image: "/figma/home-08.jpg",
    alt: "Kakashi collectible photographed against a dark background",
    description:
      "Watch this space for the next hangout, watch party or tournament from the PH Otakus crew.",
    status: "Next up",
  },
];

export const stories: StoryItem[] = [
  {
    slug: "october-anime-hype",
    title: "The Hype That October Brings to the Otaku Community",
    category: "Anime",
    date: "Community notes",
    image: "/figma/blog-06.jpg",
    alt: "A wall of colourful anime scenes from the PH Otakus library",
    excerpt:
      "A season of returns, discoveries and the conversations that keep the group chat moving.",
  },
  {
    slug: "why-local-community-matters",
    title: "Why Local Community Changes the Way We Enjoy Fandom",
    category: "Community",
    date: "Field notes",
    image: "/figma/blog-01.jpg",
    alt: "PH Otakus members smiling together after a community gathering",
    excerpt:
      "The best recommendations are better when they lead to real friendships, shared rooms and loud reactions.",
  },
  {
    slug: "collecting-in-ph",
    title: "Collecting in PH: Figures, Posters and the Stories We Keep",
    category: "Culture",
    date: "Shelf life",
    image: "/figma/home-08.jpg",
    alt: "A Kakashi figure posed with blue lightning",
    excerpt:
      "A quick look at the objects, characters and memories that turn a shelf into a personal archive.",
  },
];

export const gallery = [
  {
    image: "/figma/home-05.jpg",
    alt: "PH Otakus members cheering together outdoors",
    label: "The crew",
    note: "Community day",
  },
  {
    image: "/figma/event-01.jpg",
    alt: "Vintage comic book covers arranged around Doctor Doom",
    label: "Comic culture",
    note: "Event artwork",
  },
  {
    image: "/figma/blog-06.jpg",
    alt: "A collage wall of anime scenes",
    label: "What we watch",
    note: "Anime archive",
  },
  {
    image: "/figma/home-08.jpg",
    alt: "Kakashi collectible with blue lightning",
    label: "Collectors",
    note: "Shelf stories",
  },
  {
    image: "/figma/home-15.jpg",
    alt: "Colourful vintage comic book covers",
    label: "Panels & pages",
    note: "Manga and comics",
  },
  {
    image: "/figma/home-07.jpg",
    alt: "Vintage illustrated travel poster",
    label: "Meetups",
    note: "Out in Port Harcourt",
  },
];

export const communityLanes = [
  {
    number: "01",
    title: "Anime & manga",
    copy: "Watch parties, seasonal picks, manga swaps and the kind of recommendations that become full debates.",
    accent: "blue",
  },
  {
    number: "02",
    title: "Gaming",
    copy: "Tournaments, casual sessions and friendly rivalry across console, mobile and tabletop games.",
    accent: "red",
  },
  {
    number: "03",
    title: "Cosplay",
    copy: "A place to build, perform, photograph and learn—whether it is your first costume or your fiftieth.",
    accent: "orange",
  },
  {
    number: "04",
    title: "Creators",
    copy: "Artists, writers, designers, photographers and makers shaping the visual language of the community.",
    accent: "charcoal",
  },
];
