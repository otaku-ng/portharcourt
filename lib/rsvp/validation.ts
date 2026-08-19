import { z } from "zod";

export const rsvpActionSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  status: z.enum(["GOING", "INTERESTED", "REMOVE"]),
});

export type RsvpActionValues = z.infer<typeof rsvpActionSchema>;

export function parseRsvpAction(formData: FormData) {
  const slug = formData.get("slug");
  const status = formData.get("status");
  return rsvpActionSchema.safeParse({
    slug: typeof slug === "string" ? slug : "",
    status: typeof status === "string" ? status : "",
  });
}
