import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { events } from "@/lib/site-data";
import { button, displayHeading, kicker, shell, textLink } from "@/lib/tailwind";

const event = events[0];

export const metadata: Metadata = {
  title: event.title,
  description: event.description,
};

export default function EventDetailPage() {
  return (
    <main className="overflow-hidden">
      <section className={`${shell} pb-[90px] pt-[60px]`}>
        <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase" href="/events">← Back to events</Link>
        <div className="my-[70px] mb-[50px] grid grid-cols-[1.4fr_0.6fr] items-end gap-[8vw] max-[820px]:my-[60px] max-[820px]:grid-cols-1 max-[820px]:gap-[34px]">
          <div>
            <p className={kicker}><span className="text-brand-red">{event.status}</span> {event.eyebrow}</p>
            <h1 className={`${displayHeading} mt-5 font-black tracking-[-0.03em] text-[clamp(4.2rem,8vw,8.4rem)] leading-[0.78] uppercase max-[560px]:text-[clamp(3.7rem,18vw,5.8rem)]`}>Otaku PH City<br /><em className="font-inherit not-italic text-brand-blue">Casual Hangout.</em></h1>
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
          <h2 className={`${displayHeading} my-6 mb-[34px] text-[clamp(3rem,5vw,5.4rem)]`}>A casual meet for <em className="font-inherit not-italic text-brand-red">serious fans.</em></h2>
          <p>The PH City Casual Hangout created a low-pressure room for people to meet other fans, talk about what they were watching and reading, and turn online connections into real ones.</p>
          <p className="mt-5">The event lives in the archive now, but the idea still drives the community: good people, a welcoming space and enough shared interests to keep the conversation going all day.</p>
          <blockquote className="mt-[46px] border-l-[5px] border-brand-blue pl-6 font-display text-[clamp(1.8rem,3vw,3.2rem)] leading-none uppercase">“Come for the anime. Stay because you found your people.”</blockquote>
        </article>
        <aside className="bg-brand-paper-dark p-[30px]">
          <p className={kicker}>Event record</p>
          <dl className="my-[22px] mb-7">
            <div className="grid grid-cols-[80px_1fr] gap-[18px] border-t border-[var(--line)] py-4"><dt className="text-[0.65rem] font-black tracking-[0.1em] uppercase">Date</dt><dd className="text-[0.86rem]">{event.date}</dd></div>
            <div className="grid grid-cols-[80px_1fr] gap-[18px] border-t border-[var(--line)] py-4"><dt className="text-[0.65rem] font-black tracking-[0.1em] uppercase">Time</dt><dd className="text-[0.86rem]">{event.time}</dd></div>
            <div className="grid grid-cols-[80px_1fr] gap-[18px] border-t border-[var(--line)] py-4"><dt className="text-[0.65rem] font-black tracking-[0.1em] uppercase">Location</dt><dd className="text-[0.86rem]">{event.location}</dd></div>
            <div className="grid grid-cols-[80px_1fr] gap-[18px] border-t border-[var(--line)] py-4"><dt className="text-[0.65rem] font-black tracking-[0.1em] uppercase">Format</dt><dd className="text-[0.86rem]">Casual community meetup</dd></div>
          </dl>
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
