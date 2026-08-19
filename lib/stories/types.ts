export type StorySummary = {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  alt: string;
  excerpt: string;
};

export type PublicStory = StorySummary & {
  content: string;
  publishedAt: Date | null;
};

export type AdminStory = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl: string;
  coverImageKey: string | null;
  coverImageAlt: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
