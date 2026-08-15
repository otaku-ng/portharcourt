import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { PageIntro } from "@/components/page-intro";
import { communityLanes } from "@/lib/site-data";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Community",
  description: "Meet the fans and creators who make PH Otakus a home for fandom in Port Harcourt.",
};

export default function CommunityPage() {
  return (
    <main>
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

      <section className="community-belief section-shell">
        <p className="kicker"><span>Our belief</span> Everyone has a seat</p>
        <div>
          <h2>Fandom is better when it feels <em>close to home.</em></h2>
          <div>
            <p>PH Otakus exists to make it easier to find the people who get the references, care about the same characters and are ready to build something local together.</p>
            <p>You do not need a perfect cosplay, a giant collection or encyclopaedic knowledge. Curiosity is enough.</p>
          </div>
        </div>
      </section>

      <section className="community-lanes section-shell">
        {communityLanes.map((lane) => (
          <article className={`community-lane community-lane-${lane.accent}`} key={lane.number}>
            <span>{lane.number}</span>
            <h3>{lane.title}</h3>
            <p>{lane.copy}</p>
          </article>
        ))}
      </section>

      <section className="community-feature section-shell">
        <div className="community-feature-art" aria-hidden="true">
          <Image src="/figma/community-01.png" alt="" fill sizes="(max-width: 800px) 80vw, 38vw" />
        </div>
        <div>
          <p className="kicker"><span>Built by contributors</span> Not spectators</p>
          <h2>There is room to <em>make things.</em></h2>
          <p>Host a session. Photograph an event. Design a poster. Write a story. Introduce the community to a new series or game. The culture grows when members bring something of themselves to it.</p>
          <Link className="button button-white" href="/contact">Pitch a contribution <span>↗</span></Link>
        </div>
      </section>

      <section className="join-panel section-shell" id="join">
        <div>
          <p className="kicker"><span>Join us</span> Your first step</p>
          <h2>Ready to enter the <em>group chat?</em></h2>
        </div>
        <div>
          <p>Tell us what you are into and what you would like to see from the community. We will point you toward the next useful conversation or gathering.</p>
          <WhatsAppLink
            className="button button-red"
            fallback={<Link className="button button-red" href="/contact">Introduce yourself <span>↗</span></Link>}
          >
            Join the WhatsApp group <span>↗</span>
          </WhatsAppLink>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
