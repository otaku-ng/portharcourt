import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { PageIntro } from "@/components/page-intro";
import { getPublishedStories } from "@/lib/stories/repository";
import { button, cardEyebrow, displayHeading, kicker, sectionPadding, shell, textLink } from "@/lib/tailwind";

export const metadata: Metadata = {
  title: "Stories",
  description: "Community notes, recommendations and stories from PH Otakus.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const stories = await getPublishedStories();
  const featuredStory = stories[0] ?? null;

  return (
    <main className="overflow-hidden">
      <PageIntro
        index="03"
        eyebrow="Stories from the group chat"
        title="What we watch."
        accent="What we think."
        copy="Longer thoughts on anime, games, collecting, creative work and the community forming around them in Port Harcourt."
        image={featuredStory?.image ?? "/figma/blog-06.jpg"}
        alt={featuredStory?.alt ?? "A wall filled with colourful anime scenes"}
        imagePosition="center 54%"
      />

      {featuredStory ? (
        <section className={`${shell} ${sectionPadding} grid grid-cols-[1.15fr_0.85fr] items-center gap-[7vw] max-[820px]:grid-cols-1 max-[820px]:gap-[60px]`} id={featuredStory.slug}>
          <div className="relative h-[610px] overflow-hidden max-[560px]:h-[400px]">
            <Image className="object-cover" src={featuredStory.image} alt={featuredStory.alt} fill priority sizes="(max-width: 800px) 100vw, 55vw" />
          </div>
          <article>
            <p className={kicker}><span className="text-brand-red">Featured</span> {featuredStory.category}</p>
            <h2 className={`${displayHeading} my-6 mb-7 text-[clamp(3rem,5.2vw,5.7rem)]`}>{featuredStory.title}</h2>
            <p>{featuredStory.excerpt}</p>
            <p className="mt-[18px]">Every new season gives the community something to anticipate together. The real fun is not only in the release—it is in the theories, recommendations and weekly conversation that follows.</p>
            <Link className={`${textLink} mt-7`} href={`/blog/${featuredStory.slug}`}>Read the story <span>↗</span></Link>
          </article>
        </section>
      ) : (
        <section className={`${shell} ${sectionPadding}`}>
          <div className="border-y border-[var(--line)] py-12 text-brand-ink-soft">No published stories yet. Check back when the next note is ready.</div>
        </section>
      )}

      {stories.length > 1 ? <section className={`${shell} border-t border-[var(--line)] pb-[clamp(90px,11vw,160px)]`}>
        {stories.slice(1).map((story, index) => (
          <article className="grid grid-cols-[70px_0.8fr_1.2fr] items-center gap-9 border-b border-[var(--line)] py-14 max-[820px]:grid-cols-[54px_1fr] max-[560px]:block" id={story.slug} key={story.slug}>
            <span className="self-start font-display text-[2.3rem] text-brand-red">{String(index + 2).padStart(2, "0")}</span>
            <div className="relative h-[330px] overflow-hidden max-[820px]:col-start-2 max-[560px]:my-[22px] max-[560px]:h-[280px]"><Image className="object-cover" src={story.image} alt={story.alt} fill sizes="(max-width: 760px) 100vw, 34vw" /></div>
            <div className="max-[820px]:col-start-2">
              <p className={cardEyebrow}>{story.category} · {story.date}</p>
              <h2 className={`${displayHeading} my-4 mb-[22px] text-[clamp(2.5rem,4.2vw,4.6rem)]`}>{story.title}</h2>
              <p>{story.excerpt}</p>
              <Link className={`${textLink} mt-6`} href={`/blog/${story.slug}`}>Read the story <span>↗</span></Link>
            </div>
          </article>
        ))}
      </section> : null}

      <section className={`${shell} mb-[clamp(90px,11vw,150px)] grid grid-cols-[0.45fr_1.2fr_auto] items-center gap-10 bg-brand-red p-[46px] text-white max-[1100px]:grid-cols-[1fr_1.2fr] max-[1100px]:[&>.button]:col-start-1 max-[1100px]:[&>.button]:justify-self-start max-[560px]:grid-cols-1 max-[560px]:p-[30px]`}>
        <p className={`${kicker} text-white`}>From your point of view</p>
        <h2 className={`${displayHeading} text-[clamp(2.4rem,4vw,4.4rem)]`}>Got a story the community should read?</h2>
        <Link className={`${button} bg-brand-ink text-white hover:bg-brand-blue hover:text-brand-ink`} href="/contact">Pitch your story <span>↗</span></Link>
      </section>

      <Newsletter />
    </main>
  );
}
