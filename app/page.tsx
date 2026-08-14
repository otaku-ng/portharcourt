import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { Newsletter } from "@/components/newsletter";
import { SectionHeading } from "@/components/section-heading";
import { StoryCard } from "@/components/story-card";
import { communityLanes, events, gallery, stories } from "@/lib/site-data";

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-photo">
          <Image
            src="/figma/home-05.jpg"
            alt="PH Otakus members celebrating together in Port Harcourt"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content section-shell">
          <div className="hero-copy">
            <p className="kicker hero-kicker"><span>Est. in PH</span> Anime · Manga · Gaming · Cosplay</p>
            <h1><span>For the</span> <em>culture.</em><br />For the <strong>crew.</strong></h1>
            <p>Port Harcourt&apos;s meeting point for people who love big stories, competitive games, brilliant costumes and finding their people.</p>
            <div className="hero-actions">
              <Link className="button button-red" href="/community#join">Join the community <span>↗</span></Link>
              <Link className="button button-white" href="/events">Explore events <span>↓</span></Link>
            </div>
          </div>
          <aside className="hero-note">
            <span>Next signal</span>
            <b>The next community session</b>
            <small>Date and venue announcement soon</small>
            <Link href="/events">Keep watch <span>↗</span></Link>
          </aside>
          <div className="hero-character" aria-hidden="true">
            <Image src="/figma/home-01.png" alt="" fill sizes="(max-width: 800px) 60vw, 32vw" />
          </div>
        </div>
        <div className="hero-stamp" aria-hidden="true">4.8156° N<br />7.0498° E</div>
      </section>

      <div className="culture-strip" aria-label="Community interests">
        <div>
          <span>ANIME</span><i>✦</i><span>MANGA</span><i>✦</i><span>GAMING</span><i>✦</i><span>COSPLAY</span><i>✦</i><span>PORT HARCOURT</span><i>✦</i>
          <span>ANIME</span><i>✦</i><span>MANGA</span><i>✦</i><span>GAMING</span><i>✦</i><span>COSPLAY</span><i>✦</i><span>PORT HARCOURT</span><i>✦</i>
        </div>
      </div>

      <section className="manifesto section-shell">
        <p className="kicker"><span>01</span> Our city. Our community.</p>
        <div className="manifesto-grid">
          <h2>Built in Port Harcourt.<br /><em>Connected by fandom.</em></h2>
          <div>
            <p>PH Otakus brings together anime fans, gamers, cosplayers, artists and creators through meetups, watch parties, tournaments and shared experiences.</p>
            <p>Come exactly as you are. There is room for the lifelong fan, the curious newcomer and everyone in between.</p>
            <Link className="text-link" href="/community">Meet the community <span>↗</span></Link>
          </div>
        </div>
        <div className="manifesto-stats">
          <div><strong>01</strong><span>City</span></div>
          <div><strong>04</strong><span>Core lanes</span></div>
          <div><strong>∞</strong><span>Things to obsess over</span></div>
        </div>
      </section>

      <section className="library-collage">
        <div className="collage-copy section-shell">
          <p className="kicker"><span>From the library</span> The visual world</p>
          <h2>Panels, people and<br /><em>Port Harcourt energy.</em></h2>
        </div>
        <div className="collage-grid section-shell">
          <figure className="collage-main">
            <Image src="/figma/event-01.jpg" alt="Colourful vintage comic book covers" fill sizes="(max-width: 800px) 100vw, 58vw" />
            <figcaption>Comic culture <span>01</span></figcaption>
          </figure>
          <figure className="collage-tall">
            <Image src="/figma/home-08.jpg" alt="Kakashi collectible posed with blue lightning" fill sizes="(max-width: 800px) 100vw, 28vw" />
            <figcaption>Collector stories <span>02</span></figcaption>
          </figure>
          <figure className="collage-small">
            <Image src="/figma/blog-06.jpg" alt="A colourful wall of anime scenes" fill sizes="(max-width: 800px) 100vw, 28vw" />
            <figcaption>Watch list <span>03</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="events-preview section-shell">
        <SectionHeading
          kicker="02 / Link up in real life"
          title="Community"
          accent="events."
          copy="Hangouts, conventions, watch parties and the sessions that turn usernames into real friendships."
          href="/events"
          linkLabel="All events"
        />
        <div className="events-preview-grid">
          <EventCard event={events[2]} featured />
          <div className="events-stack">
            <EventCard event={events[0]} />
            <EventCard event={events[1]} />
          </div>
        </div>
      </section>

      <section className="lanes-section">
        <div className="section-shell">
          <SectionHeading
            light
            kicker="03 / Find your lane"
            title="There is a crew"
            accent="for that."
            copy="Different obsessions, one community. Pick a lane or move between all four."
          />
          <div className="lane-grid">
            {communityLanes.map((lane) => (
              <Link className={`lane-card lane-${lane.accent}`} href="/community" key={lane.number}>
                <span>{lane.number}</span>
                <h3>{lane.title}</h3>
                <p>{lane.copy}</p>
                <b>Explore <i>↗</i></b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-preview section-shell">
        <SectionHeading
          kicker="04 / Community archive"
          title="This is"
          accent="PH Otakus."
          href="/gallery"
          linkLabel="Open gallery"
        />
        <div className="home-gallery">
          {gallery.slice(0, 5).map((item, index) => (
            <figure className={`home-gallery-item home-gallery-${index + 1}`} key={item.label}>
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 760px) 100vw, 40vw" />
              <figcaption><span>{String(index + 1).padStart(2, "0")}</span><b>{item.label}</b></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="stories-preview section-shell">
        <SectionHeading
          kicker="05 / From the group chat"
          title="Stories worth"
          accent="sharing."
          href="/blog"
          linkLabel="All stories"
        />
        <div className="story-grid">
          {stories.map((story, index) => <StoryCard story={story} index={index} key={story.slug} />)}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
