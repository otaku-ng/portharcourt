import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { displayHeading, kicker, shell, textLink } from "@/lib/tailwind";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Join, collaborate with or contact the PH Otakus community in Port Harcourt.",
};

export default function ContactPage() {
  return (
    <main className="overflow-hidden bg-brand-paper-dark">
      <section className={`${shell} relative grid min-h-[720px] grid-cols-[1.2fr_0.8fr] items-end gap-[4vw] overflow-visible pb-[70px] pt-[90px] max-[820px]:grid-cols-1 max-[820px]:pb-0 max-[560px]:min-h-0`}>
        <div>
          <p className={kicker}>
            <span className="text-brand-red">05</span> Say hello
          </p>
          <h1 className={`${displayHeading} my-6 mb-[30px] font-black tracking-[-0.03em] text-[clamp(4.5rem,8.8vw,9.2rem)] leading-[0.78] max-[560px]:text-[clamp(3.7rem,18vw,5.8rem)]`}>
            Let&apos;s make something <em className="font-inherit not-italic text-brand-red">good together.</em>
          </h1>
          <p className="max-w-[640px] text-[1.05rem]">
            Join the community, pitch a collaboration, suggest an event or tell
            us what you want to see next.
          </p>
        </div>
        <div className="relative min-h-[620px] self-stretch max-[820px]:min-h-[520px] max-[560px]:min-h-[410px]" aria-hidden="true">
          <Image
            className="object-contain [object-position:bottom_right]"
            src="/figma/community-01.png"
            alt=""
            fill
            priority
            sizes="(max-width: 800px) 70vw, 35vw"
          />
        </div>
      </section>

      <section className={`${shell} grid grid-cols-3 pb-[clamp(90px,10vw,140px)] max-[820px]:grid-cols-1`}>
        <a
          className="group flex min-h-[430px] flex-col bg-brand-blue p-8 transition-transform duration-[220ms] hover:-translate-y-2"
          href="mailto:ph@otaku.ng?subject=I%20want%20to%20join%20PH%20Otakus"
        >
          <span className="font-display text-[2rem]">01</span>
          <h2 className={`${displayHeading} mt-auto text-[clamp(2.4rem,4vw,4.4rem)]`}>Join the crew</h2>
          <p className="mt-[22px] text-[0.84rem]">
            Introduce yourself, your favourite series or game, and what you hope
            to find in the community.
          </p>
          <b className="mt-7 border-t border-current pt-3.5 text-[0.7rem] tracking-[0.1em] uppercase">Email us ↗</b>
        </a>
        <a
          className="group flex min-h-[430px] flex-col bg-brand-red p-8 text-white transition-transform duration-[220ms] hover:-translate-y-2"
          href="mailto:ph@otaku.ng?subject=PH%20Otakus%20collaboration"
        >
          <span className="font-display text-[2rem]">02</span>
          <h2 className={`${displayHeading} mt-auto text-[clamp(2.4rem,4vw,4.4rem)]`}>Collaborate</h2>
          <p className="mt-[22px] text-[0.84rem]">
            For venues, brands, creators and communities who want to build a
            thoughtful project with us.
          </p>
          <b className="mt-7 border-t border-current pt-3.5 text-[0.7rem] tracking-[0.1em] uppercase">Start a conversation ↗</b>
        </a>
        <a
          className="group flex min-h-[430px] flex-col bg-brand-orange p-8 transition-transform duration-[220ms] hover:-translate-y-2"
          href="mailto:ph@otaku.ng?subject=PH%20Otakus%20event%20idea"
        >
          <span className="font-display text-[2rem]">03</span>
          <h2 className={`${displayHeading} mt-auto text-[clamp(2.4rem,4vw,4.4rem)]`}>Pitch an event</h2>
          <p className="mt-[22px] text-[0.84rem]">
            Bring us the watch party, tournament, workshop or gathering you wish
            existed in Port Harcourt.
          </p>
          <b className="mt-7 border-t border-current pt-3.5 text-[0.7rem] tracking-[0.1em] uppercase">Send the idea ↗</b>
        </a>
      </section>

      <section className={`${shell} grid grid-cols-3 gap-[50px] border-t border-[var(--line)] py-[70px] pb-[120px] max-[820px]:grid-cols-2 max-[560px]:grid-cols-1`}>
        <div>
          <p className="mb-3.5 text-[0.72rem] font-black tracking-[0.18em] uppercase">Direct line</p>
          <a className="font-display text-[clamp(1.6rem,3vw,3.1rem)] uppercase" href="mailto:ph@otaku.ng">ph@otaku.ng</a>
        </div>
        <div>
          <p className="mb-3.5 text-[0.72rem] font-black tracking-[0.18em] uppercase">Home base</p>
          <p>Port Harcourt, Rivers State, Nigeria</p>
        </div>
        <div>
          <p className="mb-3.5 text-[0.72rem] font-black tracking-[0.18em] uppercase">Before you go</p>
          <Link className={textLink} href="/events">
            See community events <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
