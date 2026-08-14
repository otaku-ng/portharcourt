import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { Newsletter } from "@/components/newsletter";
import { PageIntro } from "@/components/page-intro";
import { events } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Events",
  description: "Community events, meetups and the PH Otakus archive in Port Harcourt.",
};

export default function EventsPage() {
  return (
    <main>
      <PageIntro
        index="01"
        eyebrow="Events and meetups"
        title="Link up"
        accent="in real life."
        copy="Watch parties, casual hangouts, tournaments, conventions and every excuse to gather the community in one place."
        image="/figma/event-01.jpg"
        alt="Colourful vintage comic book covers"
        imagePosition="center 48%"
      />

      <section className="event-listing section-shell" id="next-up">
        <div className="listing-lead">
          <p className="kicker"><span>Next up</span> Announcements</p>
          <h2>Something good is <em>loading.</em></h2>
          <p>The next community date and venue will be announced soon. Join the crew to hear it first.</p>
          <Link className="button button-red" href="/community#join">Join for updates <span>↗</span></Link>
        </div>
        <EventCard event={events[2]} featured />
      </section>

      <section className="archive-section section-shell" id="archive">
        <div className="archive-heading">
          <p className="kicker"><span>Previously in PH</span> The event archive</p>
          <h2>Good rooms. Great people.<br /><em>Plenty of memories.</em></h2>
        </div>
        <div className="archive-grid">
          {events.slice(0, 2).map((event) => <EventCard event={event} key={event.slug} />)}
        </div>
      </section>

      <section className="host-callout section-shell">
        <span>Have an idea?</span>
        <h2>Bring an event to the community.</h2>
        <p>Pitch a watch party, gaming session, creative workshop or collaboration and let&apos;s shape it together.</p>
        <Link className="button button-dark" href="/contact">Start a conversation <span>↗</span></Link>
      </section>

      <Newsletter />
    </main>
  );
}
