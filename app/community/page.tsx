import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { PageIntro } from "@/components/page-intro";
import { communityLanes } from "@/lib/site-data";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { button, displayHeading, kicker, sectionPadding, shell } from "@/lib/tailwind";

export const metadata: Metadata = {
  title: "Community",
  description: "Meet the fans and creators who make PH Otakus a home for fandom in Port Harcourt.",
};

export default function CommunityPage() {
  return (
    <main className="overflow-hidden">
      <PageIntro
        index="02"
        eyebrow="The people behind the culture"
        title="Come for fandom."
        accent="Find your people."
        copy="A local community for anime fans, gamers, cosplayers, artists, makers and people still figuring out which of those labels fits."
        image="/figma/home-05.jpg"
        alt="PH Otakus community members smiling together outdoors"
        imagePosition="center 42%"
      />

      <section className={`${shell} ${sectionPadding}`}>
        <p className={`${kicker} mb-[34px]`}><span className="text-brand-red">Our belief</span> Everyone has a seat</p>
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-[8vw] max-[820px]:grid-cols-1 max-[820px]:gap-9">
          <h2 className={`${displayHeading} text-[clamp(3.1rem,6.5vw,6.8rem)]`}>Fandom is better when it feels <em className="font-inherit not-italic text-brand-red">close to home.</em></h2>
          <div>
            <p>PH Otakus exists to make it easier to find the people who get the references, care about the same characters and are ready to build something local together.</p>
            <p className="mt-[18px]">You do not need a perfect cosplay, a giant collection or encyclopaedic knowledge. Curiosity is enough.</p>
          </div>
        </div>
      </section>

      <section className={`${shell} grid grid-cols-4 pb-[clamp(90px,11vw,160px)] max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1`}>
        {communityLanes.map((lane) => (
          <article className={`relative min-h-[370px] border border-[var(--line)] p-[26px] max-[1100px]:border-l max-[560px]:min-h-[320px] max-[560px]:[&+article]:border-t-8 ${lane.accent === "blue" ? "border-t-8 border-t-brand-blue" : lane.accent === "red" ? "border-t-8 border-t-brand-red" : lane.accent === "orange" ? "border-t-8 border-t-brand-orange" : "border-t-8 border-t-brand-ink"} ${lane.number !== "01" ? "border-l-0 max-[1100px]:border-l max-[560px]:border-l" : ""}`} key={lane.number}>
            <span className="font-display text-[2rem]">{lane.number}</span>
            <h3 className="mt-[110px] font-display text-[clamp(2rem,3vw,3.4rem)] leading-[0.9] uppercase">{lane.title}</h3>
            <p className="mt-[18px] text-[0.82rem]">{lane.copy}</p>
          </article>
        ))}
      </section>

      <section className={`${shell} mb-[clamp(90px,11vw,150px)] grid min-h-[650px] grid-cols-[0.9fr_1.1fr] items-center gap-[4vw] overflow-hidden bg-brand-ink pr-[7vw] text-white max-[820px]:grid-cols-1 max-[820px]:px-8 max-[820px]:pb-[50px] max-[560px]:px-[22px] max-[560px]:pb-9`}>
        <div className="relative min-h-[650px] self-stretch max-[820px]:min-h-[500px] max-[560px]:min-h-[390px]" aria-hidden="true">
          <Image className="object-contain [object-position:bottom_center]" src="/figma/community-01.png" alt="" fill sizes="(max-width: 800px) 80vw, 38vw" />
        </div>
        <div>
          <p className={kicker}><span className="text-brand-red">Built by contributors</span> Not spectators</p>
          <h2 className={`${displayHeading} my-6 mb-[30px] text-[clamp(3rem,5.5vw,6rem)]`}>There is room to <em className="font-inherit not-italic text-brand-orange">make things.</em></h2>
          <p className="max-w-[600px]">Host a session. Photograph an event. Design a poster. Write a story. Introduce the community to a new series or game. The culture grows when members bring something of themselves to it.</p>
          <Link className={`${button} mt-[30px] bg-white text-brand-ink hover:bg-brand-blue`} href="/contact">Pitch a contribution <span>↗</span></Link>
        </div>
      </section>

      <section className={`${shell} mb-[clamp(90px,11vw,150px)] grid grid-cols-[1.15fr_0.65fr] gap-[10vw] border-y border-[var(--line)] py-[58px] max-[820px]:grid-cols-1 max-[820px]:gap-[42px]`} id="join">
        <div>
          <p className={kicker}><span className="text-brand-red">Join us</span> Your first step</p>
          <h2 className={`${displayHeading} mt-5 text-[clamp(3rem,5vw,5.4rem)]`}>Ready to enter the <em className="font-inherit not-italic text-brand-red">group chat?</em></h2>
        </div>
        <div className="self-end">
          <p>Tell us what you are into and what you would like to see from the community. We will point you toward the next useful conversation or gathering.</p>
          <WhatsAppLink
            className={`${button} mt-7 bg-brand-red text-white hover:bg-brand-coral`}
            fallback={<Link className={`${button} mt-7 bg-brand-red text-white hover:bg-brand-coral`} href="/contact">Introduce yourself <span>↗</span></Link>}
          >
            Join the WhatsApp group <span>↗</span>
          </WhatsAppLink>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
