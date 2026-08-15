import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { Newsletter } from "@/components/newsletter";
import { PageIntro } from "@/components/page-intro";
import { events } from "@/lib/site-data";
import { button, displayHeading, kicker, sectionPadding, shell } from "@/lib/tailwind";

export const metadata: Metadata = {
  title: "Events",
  description: "Community events, meetups and the PH Otakus archive in Port Harcourt.",
};

export default function EventsPage() {
  return (
    <main className="overflow-hidden">
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

      <section className={`${shell} ${sectionPadding} grid grid-cols-[0.72fr_1.28fr] items-center gap-[8vw] max-[820px]:grid-cols-1 max-[820px]:gap-[60px]`} id="next-up">
        <div>
          <p className={kicker}><span className="text-brand-red">Next up</span> Announcements</p>
          <h2 className={`${displayHeading} my-6 text-[clamp(3.1rem,6.5vw,6.8rem)]`}>Something good is <em className="font-inherit not-italic text-brand-red">loading.</em></h2>
          <p className="mb-7">The next community date and venue will be announced soon. Join the crew to hear it first.</p>
          <Link className={`${button} bg-brand-red text-white hover:bg-brand-coral`} href="/community#join">Join for updates <span>↗</span></Link>
        </div>
        <EventCard event={events[2]} featured variant="listing" />
      </section>

      <section className={`${shell} ${sectionPadding} border-t border-[var(--line)]`} id="archive">
        <div className="grid grid-cols-[0.7fr_1.3fr] gap-[5vw] max-[820px]:grid-cols-1">
          <p className={kicker}><span className="text-brand-red">Previously in PH</span> The event archive</p>
          <h2 className={`${displayHeading} text-[clamp(3.1rem,6.5vw,6.8rem)]`}>Good rooms. Great people.<br /><em className="font-inherit not-italic text-brand-red">Plenty of memories.</em></h2>
        </div>
        <div className="mt-[70px] grid grid-cols-2 gap-7 max-[820px]:grid-cols-1">
          {events.slice(0, 2).map((event) => <EventCard event={event} variant="archive" key={event.slug} />)}
        </div>
      </section>

      <section className={`${shell} mb-[clamp(90px,11vw,150px)] grid grid-cols-[0.5fr_1.2fr_0.8fr_auto] items-center gap-[30px] bg-brand-blue p-[46px] max-[1100px]:grid-cols-[1fr_1.2fr] max-[1100px]:[&>p]:col-start-1 max-[1100px]:[&>p]:row-start-2 max-[1100px]:[&>.button]:col-start-1 max-[1100px]:[&>.button]:justify-self-start max-[560px]:grid-cols-1 max-[560px]:p-[30px] max-[560px]:[&>p]:col-start-1 max-[560px]:[&>p]:row-start-auto`}>
        <span className="text-[0.7rem] font-black tracking-[0.15em] uppercase">Have an idea?</span>
        <h2 className={`${displayHeading} text-[clamp(2.2rem,3.7vw,4.2rem)]`}>Bring an event to the community.</h2>
        <p className="text-[0.86rem]">Pitch a watch party, gaming session, creative workshop or collaboration and let&apos;s shape it together.</p>
        <Link className={`${button} bg-brand-ink text-white hover:bg-brand-blue hover:text-brand-ink`} href="/contact">Start a conversation <span>↗</span></Link>
      </section>

      <Newsletter />
    </main>
  );
}
