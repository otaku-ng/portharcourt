import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { events } from "@/lib/site-data";

const event = events[0];

export const metadata: Metadata = {
  title: event.title,
  description: event.description,
};

export default function EventDetailPage() {
  return (
    <main>
      <section className="event-detail-hero section-shell">
        <Link className="back-link" href="/events">← Back to events</Link>
        <div className="event-detail-title">
          <div>
            <p className="kicker"><span>{event.status}</span> {event.eyebrow}</p>
            <h1>Otaku PH City<br /><em>Casual Hangout.</em></h1>
          </div>
          <p>{event.description}</p>
        </div>
        <div className="event-detail-image">
          <Image src={event.image} alt={event.alt} fill priority sizes="100vw" />
        </div>
      </section>

      <section className="event-detail-body section-shell">
        <article>
          <p className="kicker">About the day</p>
          <h2>A casual meet for <em>serious fans.</em></h2>
          <p>The PH City Casual Hangout created a low-pressure room for people to meet other fans, talk about what they were watching and reading, and turn online connections into real ones.</p>
          <p>The event lives in the archive now, but the idea still drives the community: good people, a welcoming space and enough shared interests to keep the conversation going all day.</p>
          <blockquote>“Come for the anime. Stay because you found your people.”</blockquote>
        </article>
        <aside className="event-facts">
          <p className="kicker">Event record</p>
          <dl>
            <div><dt>Date</dt><dd>{event.date}</dd></div>
            <div><dt>Time</dt><dd>{event.time}</dd></div>
            <div><dt>Location</dt><dd>{event.location}</dd></div>
            <div><dt>Format</dt><dd>Casual community meetup</dd></div>
          </dl>
          <Link className="button button-red" href="/events">See upcoming plans <span>↗</span></Link>
        </aside>
      </section>

      <section className="event-memory section-shell">
        <div className="event-memory-image"><Image src="/figma/home-05.jpg" alt="PH Otakus community members celebrating together" fill sizes="(max-width: 800px) 100vw, 60vw" /></div>
        <div>
          <p className="kicker">Why it matters</p>
          <h2>The room is the <em>real headline.</em></h2>
          <p>Events are where the culture becomes tangible. New friendships begin, creators find collaborators and people leave with more than a camera roll.</p>
          <Link className="text-link" href="/gallery">Visit the archive <span>↗</span></Link>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
