"use server";

import { RsvpStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getMember } from "@/lib/auth/member";
import { getMemberProfileByUserId } from "@/lib/profiles/repository";
import { evaluateBadgesForUser } from "@/lib/badges/service";
import { getPublishedEventForRsvp, removeEventRsvp, setEventRsvp } from "@/lib/rsvp/repository";
import { parseRsvpAction } from "@/lib/rsvp/validation";

export type RsvpActionState = {
  error?: string;
  message?: string;
};

export async function rsvpAction(
  _previousState: RsvpActionState,
  formData: FormData,
): Promise<RsvpActionState> {
  const member = await getMember();
  if (!member) return { error: "Sign in to RSVP to this event." };

  const parsed = parseRsvpAction(formData);
  if (!parsed.success) return { error: "Choose a valid RSVP option." };

  const event = await getPublishedEventForRsvp(parsed.data.slug);
  if (!event) return { error: "This event is not available for RSVPs." };

  try {
    if (parsed.data.status === "REMOVE") {
      await removeEventRsvp(member.userId, event.id);
    } else {
      await setEventRsvp(member.userId, event.id, parsed.data.status === "GOING" ? RsvpStatus.GOING : RsvpStatus.INTERESTED);
    }

    await evaluateBadgesForUser(member.userId);
  } catch {
    return { error: "We could not update your RSVP. Try again." };
  }

  const profile = await getMemberProfileByUserId(member.userId);
  revalidatePath(`/events/${event.slug}`);
  revalidatePath("/events");
  revalidatePath("/profile");
  if (profile) revalidatePath(`/members/${profile.username}`);

  return { message: parsed.data.status === "REMOVE" ? "RSVP removed." : `Marked as ${parsed.data.status === "GOING" ? "going" : "interested"}.` };
}
