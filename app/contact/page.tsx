import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Join, collaborate with or contact the PH Otakus community in Port Harcourt.",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero section-shell">
        <div>
          <p className="kicker">
            <span>05</span> Say hello
          </p>
          <h1>
            Let&apos;s make something <em>good together.</em>
          </h1>
          <p>
            Join the community, pitch a collaboration, suggest an event or tell
            us what you want to see next.
          </p>
        </div>
        <div className="contact-art" aria-hidden="true">
          <Image
            src="/figma/community-01.png"
            alt=""
            fill
            priority
            sizes="(max-width: 800px) 70vw, 35vw"
          />
        </div>
      </section>

      <section className="contact-grid section-shell">
        <a
          className="contact-card contact-card-blue"
          href="mailto:ph@otaku.ng?subject=I%20want%20to%20join%20PH%20Otakus"
        >
          <span>01</span>
          <h2>Join the crew</h2>
          <p>
            Introduce yourself, your favourite series or game, and what you hope
            to find in the community.
          </p>
          <b>Email us ↗</b>
        </a>
        <a
          className="contact-card contact-card-red"
          href="mailto:ph@otaku.ng?subject=PH%20Otakus%20collaboration"
        >
          <span>02</span>
          <h2>Collaborate</h2>
          <p>
            For venues, brands, creators and communities who want to build a
            thoughtful project with us.
          </p>
          <b>Start a conversation ↗</b>
        </a>
        <a
          className="contact-card contact-card-orange"
          href="mailto:ph@otaku.ng?subject=PH%20Otakus%20event%20idea"
        >
          <span>03</span>
          <h2>Pitch an event</h2>
          <p>
            Bring us the watch party, tournament, workshop or gathering you wish
            existed in Port Harcourt.
          </p>
          <b>Send the idea ↗</b>
        </a>
      </section>

      <section className="contact-details section-shell">
        <div>
          <p className="kicker">Direct line</p>
          <a href="mailto:ph@otaku.ng">ph@otaku.ng</a>
        </div>
        <div>
          <p className="kicker">Home base</p>
          <p>Port Harcourt, Rivers State, Nigeria</p>
        </div>
        <div>
          <p className="kicker">Before you go</p>
          <Link className="text-link" href="/events">
            See community events <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
