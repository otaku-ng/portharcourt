import { z } from "zod";

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.string().trim().max(max).nullable(),
  );

const optionalHttpUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z
    .string()
    .trim()
    .url("Enter a valid registration URL.")
    .refine((value) => {
      try {
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
      } catch {
        return false;
      }
    }, "Registration links must use http:// or https://.")
    .nullable(),
);

const optionalDateTime = z.preprocess(
  (value) => {
    if (typeof value !== "string" || value.trim() === "") return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  },
  z.date().nullable(),
);

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required.").max(160),
    slug: optionalText(100),
    eyebrow: z.string().trim().min(1, "Eyebrow is required.").max(100),
    description: z.string().trim().min(1, "Description is required.").max(5000),
    content: optionalText(50000),
    registrationUrl: optionalHttpUrl,
    registrationLabel: optionalText(80),
    startAt: optionalDateTime,
    endAt: optionalDateTime,
    dateLabel: optionalText(100),
    timeLabel: optionalText(100),
    location: z.string().trim().min(1, "Location is required.").max(160),
    venue: optionalText(160),
    coverImageUrl: optionalText(1000),
    coverImageKey: optionalText(500),
    coverImageAlt: z.string().trim().min(1, "Cover image alt text is required.").max(240),
    status: z.enum(["UPCOMING", "ARCHIVED"]),
    published: z.boolean(),
    media: z.array(
      z.object({
        clientId: z.string().trim().min(1).max(500).optional(),
        id: z.string().trim().min(1).max(100).optional(),
        objectKey: z.string().trim().max(500).optional(),
        alt: z.string().trim().min(1, "Alt text is required.").max(240),
        caption: optionalText(500),
        type: z.enum(["IMAGE", "FLYER"]),
      }),
    ).max(100, "An event can have no more than 100 media items."),
  })
  .superRefine((value, context) => {
    if (value.startAt && value.endAt && value.endAt < value.startAt) {
      context.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "End time must be after the start time.",
      });
    }
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseEventForm(formData: FormData) {
  return eventFormSchema.safeParse({
    title: getString(formData, "title"),
    slug: getString(formData, "slug"),
    eyebrow: getString(formData, "eyebrow"),
    description: getString(formData, "description"),
    content: getString(formData, "content"),
    registrationUrl: getString(formData, "registrationUrl"),
    registrationLabel: getString(formData, "registrationLabel"),
    startAt: getString(formData, "startAt"),
    endAt: getString(formData, "endAt"),
    dateLabel: getString(formData, "dateLabel"),
    timeLabel: getString(formData, "timeLabel"),
    location: getString(formData, "location"),
    venue: getString(formData, "venue"),
    coverImageUrl: getString(formData, "coverImageUrl"),
    coverImageKey: getString(formData, "coverImageKey"),
    coverImageAlt: getString(formData, "coverImageAlt"),
    status: getString(formData, "status"),
    published: formData.get("published") === "on",
    media: parseMediaInput(getString(formData, "media")),
  });
}

function parseMediaInput(value: string): unknown {
  if (!value.trim()) return [];

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export { normalizeSlug } from "@/lib/slug";

export function getZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}

export function formatDateTimeInput(value: Date | null): string {
  if (!value) return "";
  return value.toISOString().slice(0, 16);
}
