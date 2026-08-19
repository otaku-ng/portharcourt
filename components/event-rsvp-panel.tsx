"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { RsvpStatus } from "@prisma/client";
import type { RsvpActionState } from "@/lib/rsvp/actions";
import { rsvpAction } from "@/lib/rsvp/actions";

const initialState: RsvpActionState = {};

export function EventRsvpPanel({
  slug,
  signedIn,
  goingCount,
  interestedCount,
  currentUserRsvp,
  rsvpOpen,
}: {
  slug: string;
  signedIn: boolean;
  goingCount: number;
  interestedCount: number;
  currentUserRsvp: RsvpStatus | null;
  rsvpOpen: boolean;
}) {
  const [state, formAction, pending] = useActionState(rsvpAction, initialState);

  return (
    <section className="mt-8 border-t border-[var(--line)] pt-6" aria-labelledby="rsvp-heading">
      <p className="text-[0.7rem] font-black tracking-[0.13em] text-brand-red uppercase" id="rsvp-heading">Join the room</p>
      <div className="mt-4 flex flex-wrap gap-5 text-sm font-black uppercase">
        <span>{goingCount} Going</span>
        <span>{interestedCount} Interested</span>
      </div>
      {!rsvpOpen ? (
        <div className="mt-5 border-l-4 border-brand-ink bg-brand-paper-dark px-4 py-3 text-sm">
          <p className="font-black tracking-[0.08em] uppercase">RSVP closed</p>
          <p className="mt-1 text-brand-ink-soft">This event is no longer accepting new RSVPs.</p>
          {currentUserRsvp ? <p className="mt-2 text-brand-ink-soft">Your RSVP is recorded as <span className="font-black uppercase">{currentUserRsvp.toLowerCase()}</span>.</p> : null}
        </div>
      ) : signedIn ? (
        <form className="mt-5 grid gap-3" action={formAction}>
          <input name="slug" type="hidden" value={slug} />
          <div className="flex flex-wrap gap-2">
            <button className={`min-h-11 border px-4 text-[0.72rem] font-black tracking-[0.08em] uppercase transition-colors hover:bg-brand-blue disabled:cursor-wait disabled:opacity-60 ${currentUserRsvp === "GOING" ? "border-brand-red bg-brand-red text-white hover:bg-brand-coral" : "border-brand-ink"}`} disabled={pending} name="status" type="submit" value="GOING" aria-pressed={currentUserRsvp === "GOING"}>
              Going
            </button>
            <button className={`min-h-11 border px-4 text-[0.72rem] font-black tracking-[0.08em] uppercase transition-colors hover:bg-brand-blue disabled:cursor-wait disabled:opacity-60 ${currentUserRsvp === "INTERESTED" ? "border-brand-red bg-brand-red text-white hover:bg-brand-coral" : "border-brand-ink"}`} disabled={pending} name="status" type="submit" value="INTERESTED" aria-pressed={currentUserRsvp === "INTERESTED"}>
              Interested
            </button>
            {currentUserRsvp ? <button className="min-h-11 border border-transparent px-2 text-[0.72rem] font-black tracking-[0.08em] uppercase underline underline-offset-4 hover:text-brand-red disabled:cursor-wait disabled:opacity-60" disabled={pending} name="status" type="submit" value="REMOVE">Remove RSVP</button> : null}
          </div>
          {state.error ? <p className="text-sm text-brand-red" role="alert">{state.error}</p> : null}
          {state.message ? <p className="text-sm text-brand-ink-soft" role="status">{state.message}</p> : null}
        </form>
      ) : (
        <div className="mt-5">
          <Link className="inline-flex min-h-11 items-center bg-brand-red px-4 text-[0.72rem] font-black tracking-[0.08em] text-white uppercase hover:bg-brand-coral" href={`/signin?callbackUrl=${encodeURIComponent(`/events/${slug}`)}`}>Sign in to RSVP <span className="ml-5 text-base">↗</span></Link>
        </div>
      )}
    </section>
  );
}
