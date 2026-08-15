import Link from "next/link";
import { button, kicker, shell } from "@/lib/tailwind";

export function Newsletter() {
  return (
    <section className={`${shell} mb-[clamp(80px,10vw,140px)] grid grid-cols-[1.2fr_0.8fr_auto] items-center gap-[50px] bg-brand-orange p-[clamp(34px,5vw,70px)] max-[820px]:grid-cols-1 max-[820px]:gap-7`} aria-labelledby="newsletter-title">
      <div>
        <p className={kicker}>Stay in the loop</p>
        <h2 className="mt-3.5 font-display text-[clamp(2.6rem,5vw,5rem)] font-bold leading-[0.9] uppercase" id="newsletter-title">Don&apos;t miss the <em className="font-inherit not-italic text-white">next link-up.</em></h2>
      </div>
      <p className="text-[0.92rem]">Event announcements, community stories and the occasional hot take—sent when there is something worth sharing.</p>
      <Link className={`${button} bg-brand-ink text-white hover:bg-brand-blue hover:text-brand-ink max-[820px]:justify-self-start`} href="/contact">Get updates <span>↗</span></Link>
    </section>
  );
}
