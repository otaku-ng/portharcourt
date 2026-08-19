export type GalleryImageData = {
  id: string;
  url: string;
  objectKey: string | null;
  alt: string;
  caption: string | null;
  sortOrder: number;
};

export type GalleryAlbumSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  date: Date | null;
  published: boolean;
  imageCount: number;
  event: { id: string; title: string; slug: string; published: boolean } | null;
  updatedAt: Date;
};

export type AdminGalleryAlbum = GalleryAlbumSummary & {
  eventId: string | null;
  images: GalleryImageData[];
  createdAt: Date;
};

export type PublicGalleryAlbum = {
  slug: string;
  title: string;
  description: string | null;
  date: Date | null;
  event: { slug: string; title: string } | null;
  images: GalleryImageData[];
};

export type GalleryEventOption = {
  id: string;
  title: string;
  slug: string;
};
