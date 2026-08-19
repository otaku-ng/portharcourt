"use server";

import { revalidatePath } from "next/cache";
import { parseNewsletterForm } from "@/lib/newsletter/validation";
import { subscribeEmail } from "@/lib/newsletter/repository";

export type NewsletterActionState = {
  error?: string;
  success?: string;
};

export async function subscribeNewsletterAction(
  _previousState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const parsed = parseNewsletterForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };

  try {
    await subscribeEmail(parsed.data.email, "newsletter-form");
    revalidatePath("/admin/newsletter");
    return { success: "You are on the list. We will be in touch when there is something worth sharing." };
  } catch {
    return { error: "We could not save your subscription right now. Please try again." };
  }
}
