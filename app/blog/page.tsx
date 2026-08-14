import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { PageIntro } from "@/components/page-intro";
import { stories } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Stories",
  description: "Community notes, recommendations and stories from PH Otakus.",
};

export default function BlogPage() {
  return (
    <main>
      <PageIntro
        index="03"
        eyebrow="Stories from the group chat"
        title="What we watch."
        accent="What we think."
        copy="Longer thoughts on anime, games, collecting, creative work and the community forming around them in Port Harcourt."
        image="/figma/blog-06.jpg"
        alt="A wall filled with colourful anime scenes"
        imagePosition="center 54%"
      />

      <section className="featured-story section-shell" id={stories[0].slug}>
        <div className="featured-story-image">
          <Image src={stories[0].image} alt={stories[0].alt} fill priority sizes="(max-width: 800px) 100vw, 55vw" />
        </div>
        <article>
          <p className="kicker"><span>Featured</span> {stories[0].category}</p>
          <h2>{stories[0].title}</h2>
          <p>{stories[0].excerpt}</p>
          <p>Every new season gives the community something to anticipate together. The real fun is not only in the release—it is in the theories, recommendations and weekly conversation that follows.</p>
          <Link className="text-link" href="/contact">Share your take <span>↗</span></Link>
        </article>
      </section>

      <section className="story-list section-shell">
        {stories.slice(1).map((story, index) => (
          <article className="story-list-item" id={story.slug} key={story.slug}>
            <span>{String(index + 2).padStart(2, "0")}</span>
            <div className="story-list-image"><Image src={story.image} alt={story.alt} fill sizes="(max-width: 760px) 100vw, 34vw" /></div>
            <div>
              <p className="card-eyebrow">{story.category} · {story.date}</p>
              <h2>{story.title}</h2>
              <p>{story.excerpt}</p>
              <Link className="text-link" href="/contact">Join the conversation <span>↗</span></Link>
            </div>
          </article>
        ))}
      </section>

      <section className="write-callout section-shell">
        <p className="kicker">From your point of view</p>
        <h2>Got a story the community should read?</h2>
        <Link className="button button-dark" href="/contact">Pitch your story <span>↗</span></Link>
      </section>

      <Newsletter />
    </main>
  );
}
