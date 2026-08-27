import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Newsletter } from "@/components/newsletter";
import { EventRsvpPanel } from "@/components/event-rsvp-panel";
import { MarkdownContent } from "@/components/markdown-content";
import { getMember } from "@/lib/auth/member";
import { getEventBySlug, getPublishedEventDetailsBySlug } from "@/lib/event-data";
import { button, displayHeading, kicker, shell } from "@/lib/tailwind";

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
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      title: event.title,
      description: event.description,
      siteName: "PH Otakus",
      url: `/events/${event.slug}`,
      images: [{ url: event.image, alt: event.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description,
      images: [event.image],
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

      <section className={`${shell} grid items-start gap-[10vw] pb-[clamp(100px,12vw,170px)] ${event.content ? "grid-cols-[1.15fr_0.65fr] max-[820px]:grid-cols-1" : "grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)] max-[820px]:grid-cols-1"} max-[820px]:gap-[60px]`}>
        {event.content ? <article><MarkdownContent content={event.content} /></article> : null}
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
          {event.registrationUrl ? (
            <a className={`${button} mt-4 bg-brand-blue text-brand-ink hover:bg-brand-paper`} href={event.registrationUrl} rel="noopener noreferrer" target="_blank">
              {event.registrationLabel || "Register for event"} <span aria-hidden="true">↗</span><span className="sr-only"> (opens external registration site)</span>
            </a>
          ) : null}
          <Link className={`${button} bg-brand-red text-white hover:bg-brand-coral`} href="/events">Explore all events <span>↗</span></Link>
        </aside>
      </section>

      {event.media.length > 0 ? (
        <section className={`${shell} mb-[clamp(90px,11vw,150px)]`}>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-4">
            <p className={kicker}>Event media</p>
            <p className="text-sm text-brand-ink-soft">{event.media.length} {event.media.length === 1 ? "item" : "items"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
            {event.media.map((media, index) => (
              <figure className={`group ${index === 0 ? "col-span-2 max-[560px]:col-span-1" : ""}`} key={media.id}>
                <div className={`relative overflow-hidden bg-brand-ink ${index === 0 ? "h-[min(60vw,680px)] max-[560px]:h-[360px]" : "h-[min(38vw,480px)] max-[560px]:h-[320px]"}`}>
                  <Image className={`${media.type === "FLYER" ? "object-contain p-5" : "object-cover transition-transform duration-[420ms] group-hover:scale-[1.02]"}`} src={media.url} alt={media.alt} fill sizes={index === 0 ? "100vw" : "(max-width: 560px) 100vw, 50vw"} />
                </div>
                {media.caption || media.type === "FLYER" ? <figcaption className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.75rem] font-black tracking-[0.1em] uppercase">
                    {media.type === "FLYER" ? <span className="text-brand-red">Flyer</span> : null}
                    {media.caption ? <span>{media.caption}</span> : null}
                  </figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <Newsletter />
    </main>
  );
}
