import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Newsletter } from "@/components/newsletter";
import { EventRsvpPanel } from "@/components/event-rsvp-panel";
import { getMember } from "@/lib/auth/member";
import { getEventBySlug, getPublishedEventDetailsBySlug } from "@/lib/event-data";
import { button, displayHeading, kicker, shell, textLink } from "@/lib/tailwind";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event not found",
      description: "The requested PH Otakus event could not be found.",
    };
  }

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [{ url: event.image, alt: event.alt }],
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const member = await getMember();
  const event = await getPublishedEventDetailsBySlug(slug, member?.userId);

  if (!event) {
    notFound();
  }

  if (member && !member.user.profile?.profileCompleted) {
    redirect(`/profile/setup?returnTo=${encodeURIComponent(`/events/${slug}`)}`);
  }

  const isArchived = event.status === "Archive";

  return (
    <main className="overflow-hidden">
      <section className={`${shell} pb-[90px] pt-[60px]`}>
        <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase" href="/events">← Back to events</Link>
        <div className="my-[70px] mb-[50px] grid grid-cols-[1.4fr_0.6fr] items-end gap-[8vw] max-[820px]:my-[60px] max-[820px]:grid-cols-1 max-[820px]:gap-[34px]">
          <div>
            <p className={kicker}><span className="text-brand-red">{event.status}</span> {event.eyebrow}</p>
            <h1 className={`${displayHeading} mt-5 font-black tracking-[-0.03em] text-[clamp(4.2rem,8vw,8.4rem)] leading-[0.78] uppercase max-[560px]:text-[clamp(3.7rem,18vw,5.8rem)]`}>{event.title}</h1>
          </div>
          <p className="max-w-[430px]">{event.description}</p>
        </div>
        <div className="relative h-[min(68vw,760px)] min-h-[460px] overflow-hidden max-[560px]:h-[360px] max-[560px]:min-h-0">
          <Image className="object-cover" src={event.image} alt={event.alt} fill priority sizes="100vw" />
        </div>
      </section>

      <section className={`${shell} grid grid-cols-[1.15fr_0.65fr] items-start gap-[10vw] pb-[clamp(100px,12vw,170px)] max-[820px]:grid-cols-1 max-[820px]:gap-[60px]`}>
        <article>
          <p className={kicker}>About the day</p>
          <h2 className={`${displayHeading} my-6 mb-[34px] text-[clamp(3rem,5vw,5.4rem)]`}>Good rooms. Great people. <em className="font-inherit not-italic text-brand-red">Shared obsessions.</em></h2>
          <p>{event.description}</p>
          <p className="mt-5">{isArchived ? "The event lives in the archive now, but the idea still drives the community: good people, a welcoming space and enough shared interests to keep the conversation going all day." : "The details will be shared with the community as soon as the next session is ready. Keep watch for the announcement and bring your favourite obsessions along."}</p>
          <blockquote className="mt-[46px] border-l-[5px] border-brand-blue pl-6 font-display text-[clamp(1.8rem,3vw,3.2rem)] leading-none uppercase">{isArchived ? "“Come for the anime. Stay because you found your people.”" : "“Come for the community. Stay for what comes next.”"}</blockquote>
        </article>
        <aside className="bg-brand-paper-dark p-[30px]">
          <p className={kicker}>Event record</p>
          <dl className="my-[22px] mb-7">
            <div className="grid grid-cols-[80px_1fr] gap-[18px] border-t border-[var(--line)] py-4"><dt className="text-[0.65rem] font-black tracking-[0.1em] uppercase">Date</dt><dd className="text-[0.86rem]">{event.date}</dd></div>
            <div className="grid grid-cols-[80px_1fr] gap-[18px] border-t border-[var(--line)] py-4"><dt className="text-[0.65rem] font-black tracking-[0.1em] uppercase">Time</dt><dd className="text-[0.86rem]">{event.time}</dd></div>
            <div className="grid grid-cols-[80px_1fr] gap-[18px] border-t border-[var(--line)] py-4"><dt className="text-[0.65rem] font-black tracking-[0.1em] uppercase">Location</dt><dd className="text-[0.86rem]">{event.displayLocation}</dd></div>
            <div className="grid grid-cols-[80px_1fr] gap-[18px] border-t border-[var(--line)] py-4"><dt className="text-[0.65rem] font-black tracking-[0.1em] uppercase">Format</dt><dd className="text-[0.86rem]">{event.eyebrow}</dd></div>
          </dl>
          <EventRsvpPanel
            currentUserRsvp={event.currentUserRsvp}
            goingCount={event.goingCount}
            interestedCount={event.interestedCount}
            rsvpOpen={event.rsvpOpen}
            signedIn={Boolean(member)}
            slug={event.slug}
          />
          <Link className={`${button} bg-brand-red text-white hover:bg-brand-coral`} href="/events">See upcoming plans <span>↗</span></Link>
        </aside>
      </section>

      <section className={`${shell} mb-[clamp(90px,11vw,150px)] grid grid-cols-[1.25fr_0.75fr] items-center gap-[7vw] bg-brand-blue p-[42px] max-[820px]:grid-cols-1 max-[560px]:p-[22px]`}>
        <div className="relative h-[470px] overflow-hidden max-[560px]:h-[320px]"><Image className="object-cover" src="/figma/home-05.jpg" alt="PH Otakus community members celebrating together" fill sizes="(max-width: 800px) 100vw, 60vw" /></div>
        <div>
          <p className={kicker}>Why it matters</p>
          <h2 className={`${displayHeading} my-5 mb-7 text-[clamp(2.8rem,5vw,5.4rem)]`}>The room is the <em className="font-inherit not-italic text-brand-red">real headline.</em></h2>
          <p className="mb-6">Events are where the culture becomes tangible. New friendships begin, creators find collaborators and people leave with more than a camera roll.</p>
          <Link className={textLink} href="/gallery">Visit the archive <span>↗</span></Link>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
