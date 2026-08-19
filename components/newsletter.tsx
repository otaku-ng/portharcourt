"use client";

import { useActionState } from "react";
import { subscribeNewsletterAction } from "@/lib/newsletter/actions";
import { button, kicker, shell } from "@/lib/tailwind";

export function Newsletter() {
  const [state, formAction, pending] = useActionState(subscribeNewsletterAction, {});

  return (
    <section className={`${shell} mb-[clamp(80px,10vw,140px)] grid grid-cols-[1.2fr_0.8fr_auto] items-center gap-[50px] bg-brand-orange p-[clamp(34px,5vw,70px)] max-[820px]:grid-cols-1 max-[820px]:gap-7`} aria-labelledby="newsletter-title">
      <div>
        <p className={kicker}>Stay in the loop</p>
        <h2 className="mt-3.5 font-display text-[clamp(2.6rem,5vw,5rem)] font-bold leading-[0.9] uppercase" id="newsletter-title">Don&apos;t miss the <em className="font-inherit not-italic text-white">next link-up.</em></h2>
      </div>
      <p className="text-[0.92rem]">Event announcements, community stories and the occasional hot take—sent when there is something worth sharing.</p>
      <form action={formAction} className="grid gap-3 max-[820px]:max-w-[420px]" aria-describedby="newsletter-feedback">
        <label className="text-[0.68rem] font-black tracking-[0.1em] uppercase" htmlFor="newsletter-email">Email address</label>
        <div className="flex gap-2 max-[560px]:flex-col">
          <input aria-invalid={Boolean(state.error)} autoComplete="email" className="min-h-12 min-w-0 flex-1 border border-brand-ink bg-white px-4 text-base text-brand-ink outline-none placeholder:text-brand-ink-soft focus:border-brand-blue" id="newsletter-email" name="email" placeholder="you@example.com" required type="email" />
          <button className={`${button} bg-brand-ink text-white hover:bg-brand-blue hover:text-brand-ink disabled:cursor-wait disabled:opacity-60`} disabled={pending} type="submit">{pending ? "Joining…" : "Get updates"} <span>↗</span></button>
        </div>
        <p aria-live="polite" className={`text-sm ${state.error ? "text-brand-red" : "text-brand-ink"}`} id="newsletter-feedback" role={state.error ? "alert" : "status"}>{state.error ?? state.success ?? ""}</p>
      </form>
    </section>
  );
}
