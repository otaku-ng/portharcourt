import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/lib/site-data";
import { cardEyebrow, textLink } from "@/lib/tailwind";

export function EventCard({ event, featured = false, variant = "default" }: { event: EventItem; featured?: boolean; variant?: "default" | "listing" | "archive" | "stack" }) {
  const href = event.slug === "otaku-ph-city-hangout"
    ? `/events/${event.slug}`
    : event.status === "Next up"
      ? "/events#next-up"
      : "/events#archive";

  const imageHeight = featured
    ? variant === "listing"
      ? "h-[430px] max-[560px]:h-[320px]"
      : "h-[560px] max-[560px]:h-[320px]"
    : variant === "archive"
      ? "h-[420px] max-[560px]:h-[320px]"
      : variant === "stack"
        ? "h-full min-h-[270px] max-[1100px]:h-[290px]"
        : "h-[260px] max-[560px]:h-[320px]";

  return (
    <article className={`group border-t border-[var(--line)] ${variant === "stack" ? "grid grid-cols-[160px_1fr] gap-5 max-[1100px]:block" : ""}`}>
      <Link className={`relative block overflow-hidden ${imageHeight}`} href={href}>
        <Image className="object-cover transition-transform duration-[420ms] ease-in-out group-hover:scale-[1.045]" src={event.image} alt={event.alt} fill sizes={featured ? "(max-width: 800px) 100vw, 60vw" : "(max-width: 800px) 100vw, 33vw"} />
        <span className={`absolute left-4 top-4 px-2.5 py-2 text-[0.65rem] font-black tracking-[0.13em] uppercase ${event.status === "Archive" ? "bg-brand-paper text-brand-ink" : "bg-brand-red text-white"}`}>{event.status}</span>
      </Link>
      <div className="px-0 pb-2 pt-6">
        <p className={cardEyebrow}>{event.eyebrow}</p>
        <h3 className="mt-2.5 font-display text-[clamp(1.9rem,3vw,3rem)] font-bold tracking-[-0.01em] leading-[0.95] uppercase"><Link href={href}>{event.title}</Link></h3>
        <div className="my-[18px] flex flex-wrap gap-x-7 gap-y-2 border-y border-[var(--line)] py-2.5 text-[0.7rem] font-extrabold tracking-[0.04em] uppercase">
          <span>{event.date}</span>
          <span>{event.location}</span>
        </div>
        <p className="text-[0.9rem] text-brand-ink-soft">{event.description}</p>
        <Link className={`${textLink} mt-5`} href={href}>View event <span>↗</span></Link>
      </div>
    </article>
  );
}
