import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/lib/site-data";

export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const href = event.slug === "otaku-ph-city-hangout"
    ? `/events/${event.slug}`
    : event.status === "Next up"
      ? "/events#next-up"
      : "/events#archive";

  return (
    <article className={`event-card ${featured ? "event-card-featured" : ""}`}>
      <Link className="event-card-image" href={href}>
        <Image src={event.image} alt={event.alt} fill sizes={featured ? "(max-width: 800px) 100vw, 60vw" : "(max-width: 800px) 100vw, 33vw"} />
        <span className={`status status-${event.status === "Archive" ? "archive" : "live"}`}>{event.status}</span>
      </Link>
      <div className="event-card-body">
        <p className="card-eyebrow">{event.eyebrow}</p>
        <h3><Link href={href}>{event.title}</Link></h3>
        <div className="event-meta">
          <span>{event.date}</span>
          <span>{event.location}</span>
        </div>
        <p>{event.description}</p>
        <Link className="text-link" href={href}>View event <span>↗</span></Link>
      </div>
    </article>
  );
}
