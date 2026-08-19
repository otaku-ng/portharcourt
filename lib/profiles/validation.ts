import { z } from "zod";

export const INTEREST_OPTIONS = [
  "Anime",
  "Manga",
  "Gaming",
  "Cosplay",
  "Art",
  "Photography",
  "Collecting",
  "Content Creation",
] as const;

export const CREATOR_TYPE_OPTIONS = [
  "Artist",
  "Cosplayer",
  "Photographer",
  "Streamer",
  "Writer",
  "Designer",
  "Other",
] as const;

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.string().trim().max(max).nullable(),
  );

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must be 30 characters or fewer.")
  .regex(/^[a-z0-9_-]+$/, "Use only lowercase letters, numbers, _ or -.");

export const profileSchema = z.object({
  username: usernameSchema,
  displayName: z.string().trim().min(1, "Display name is required.").max(80, "Display name must be 80 characters or fewer."),
  bio: optionalText(500),
  city: optionalText(80),
  interests: z.array(z.enum(INTEREST_OPTIONS)).max(8, "Choose up to 8 interests."),
  favouriteAnime: optionalText(120),
  favouriteManga: optionalText(120),
  favouriteGames: optionalText(120),
  creatorType: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.enum(CREATOR_TYPE_OPTIONS).nullable(),
  ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function toProfileFormValues(value: {
  username: string;
  displayName: string;
  bio?: string | null;
  city?: string | null;
  interests?: string[];
  favouriteAnime?: string | null;
  favouriteManga?: string | null;
  favouriteGames?: string | null;
  creatorType?: string | null;
}): ProfileFormValues {
  return {
    username: value.username,
    displayName: value.displayName,
    bio: value.bio ?? null,
    city: value.city ?? null,
    interests: (value.interests ?? []).filter((interest): interest is typeof INTEREST_OPTIONS[number] => INTEREST_OPTIONS.includes(interest as typeof INTEREST_OPTIONS[number])),
    favouriteAnime: value.favouriteAnime ?? null,
    favouriteManga: value.favouriteManga ?? null,
    favouriteGames: value.favouriteGames ?? null,
    creatorType: CREATOR_TYPE_OPTIONS.includes(value.creatorType as typeof CREATOR_TYPE_OPTIONS[number]) ? value.creatorType as typeof CREATOR_TYPE_OPTIONS[number] : null,
  };
}

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseProfileForm(formData: FormData) {
  return profileSchema.safeParse({
    username: getString(formData, "username"),
    displayName: getString(formData, "displayName"),
    bio: getString(formData, "bio"),
    city: getString(formData, "city"),
    interests: formData.getAll("interests").filter((value): value is string => typeof value === "string"),
    favouriteAnime: getString(formData, "favouriteAnime"),
    favouriteManga: getString(formData, "favouriteManga"),
    favouriteGames: getString(formData, "favouriteGames"),
    creatorType: getString(formData, "creatorType"),
  });
}

export function getZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field]) fieldErrors[field] = issue.message;
  }

  return fieldErrors;
}

export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "events",
  "gallery",
  "blog",
  "community",
  "contact",
  "signin",
  "login",
  "signup",
  "members",
  "profile",
  "settings",
]);

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(normalizeUsername(username));
}
