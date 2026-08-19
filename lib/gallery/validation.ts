import { z } from "zod";

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.string().trim().max(max).nullable(),
  );

const optionalDate = z.preprocess(
  (value) => {
    if (typeof value !== "string" || value.trim() === "") return null;
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? undefined : date;
  },
  z.date().nullable(),
);

const galleryImageFormSchema = z.object({
  id: z.string().trim().max(100).optional(),
  objectKey: z.string().trim().max(500).optional(),
  alt: z.string().trim().min(1, "Alt text is required.").max(240),
  caption: optionalText(500),
});

export const galleryFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160),
  slug: optionalText(100),
  description: optionalText(2000),
  eventId: optionalText(100),
  date: optionalDate,
  published: z.boolean(),
  images: z.array(galleryImageFormSchema).max(60, "Albums can contain up to 60 images."),
});

export type GalleryFormValues = z.infer<typeof galleryFormSchema>;

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function getImages(formData: FormData): unknown {
  const value = formData.get("images");
  if (typeof value !== "string" || !value) return [];

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export function parseGalleryForm(formData: FormData) {
  return galleryFormSchema.safeParse({
    title: getString(formData, "title"),
    slug: getString(formData, "slug"),
    description: getString(formData, "description"),
    eventId: getString(formData, "eventId"),
    date: getString(formData, "date"),
    published: formData.get("published") === "on",
    images: getImages(formData),
  });
}

export function formatDateInput(value: Date | null): string {
  return value ? value.toISOString().slice(0, 10) : "";
}

export { normalizeSlug } from "@/lib/slug";
