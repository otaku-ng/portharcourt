import type { MemberProfile } from "@/lib/profiles/repository";
import { displayHeading, kicker } from "@/lib/tailwind";

export function Passport({ badges }: { badges: MemberProfile["badges"] }) {
  return (
    <section className="border-t border-[var(--line)] pt-8" aria-labelledby="passport-heading">
      <p className={kicker}>Your community record</p>
      <h2 className={`${displayHeading} mt-4 text-[clamp(2.7rem,5vw,5rem)]`} id="passport-heading">Otaku Passport</h2>
      {badges.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {badges.map((badge) => (
            <article className="flex gap-4 border border-[var(--line)] bg-brand-paper-dark p-5" key={badge.key}>
              <span className="grid size-12 shrink-0 place-items-center bg-brand-blue text-2xl" aria-hidden="true">{badge.icon}</span>
              <div>
                <h3 className="font-display text-[1.55rem] uppercase leading-none">{badge.name}</h3>
                <p className="mt-2 text-sm text-brand-ink-soft">{badge.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-6 border-l-4 border-brand-red bg-brand-paper-dark px-5 py-4 text-sm">Your first badge is waiting.</p>
      )}
    </section>
  );
}
