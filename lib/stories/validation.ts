import { z } from "zod";

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.string().trim().max(max).nullable(),
  );

export const storyFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160),
  slug: optionalText(100),
  category: z.string().trim().min(1, "Category is required.").max(80),
  excerpt: z.string().trim().min(1, "Excerpt is required.").max(500),
  content: z.string().trim().min(1, "Markdown body is required.").max(30000),
  coverImageKey: optionalText(500),
  coverImageAlt: z.string().trim().min(1, "Cover image alt text is required.").max(240),
  published: z.boolean(),
});

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseStoryForm(formData: FormData) {
  return storyFormSchema.safeParse({
    title: getString(formData, "title"),
    slug: getString(formData, "slug"),
    category: getString(formData, "category"),
    excerpt: getString(formData, "excerpt"),
    content: getString(formData, "content"),
    coverImageKey: getString(formData, "coverImageKey"),
    coverImageAlt: getString(formData, "coverImageAlt"),
    published: formData.get("published") === "on",
  });
}

export { normalizeSlug } from "@/lib/slug";
