import { z } from "zod";

export const newsletterEmailSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").max(320).email("Enter a valid email address."),
});

export function parseNewsletterForm(formData: FormData) {
  const value = formData.get("email");
  return newsletterEmailSchema.safeParse({ email: typeof value === "string" ? value.toLowerCase() : "" });
}
