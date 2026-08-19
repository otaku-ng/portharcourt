import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
import { Newsletter } from "@/components/newsletter";
import { getPublishedStoryBySlug } from "@/lib/stories/repository";
import { displayHeading, kicker, sectionPadding, shell } from "@/lib/tailwind";

type StoryDetailPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: StoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getPublishedStoryBySlug(slug);
  if (!story) return { title: "Story not found", description: "The requested PH Otakus story could not be found." };

  return {
    title: story.title,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: [{ url: story.image, alt: story.alt }],
    },
  };
}

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { slug } = await params;
  const story = await getPublishedStoryBySlug(slug);
  if (!story) notFound();

  return (
    <main className="overflow-hidden">
      <section className={`${shell} ${sectionPadding}`}>
        <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase hover:text-brand-red" href="/blog">← Back to stories</Link>
        <div className="mt-14 grid grid-cols-[1.1fr_0.9fr] items-end gap-[8vw] max-[820px]:grid-cols-1 max-[820px]:gap-8">
          <div>
            <p className={kicker}><span className="text-brand-red">{story.category}</span> · {story.date}</p>
            <h1 className={`${displayHeading} mt-5 text-[clamp(4rem,8vw,8.4rem)] leading-[0.8] uppercase`}>{story.title}</h1>
          </div>
          <p className="max-w-[520px] text-[1.05rem] leading-[1.6]">{story.excerpt}</p>
        </div>
        <div className="relative mt-14 h-[min(68vw,760px)] min-h-[460px] overflow-hidden max-[560px]:h-[360px] max-[560px]:min-h-0">
          <Image className="object-cover" src={story.image} alt={story.alt} fill priority sizes="100vw" />
        </div>
      </section>

      <section className={`${shell} grid grid-cols-[0.7fr_1.3fr] items-start gap-[8vw] pb-[clamp(100px,12vw,170px)] max-[820px]:grid-cols-1 max-[820px]:gap-10`}>
        <p className={kicker}>From the group chat<br /><span className="text-brand-red">{story.date}</span></p>
        <article><MarkdownContent content={story.content} /></article>
      </section>

      <Newsletter />
    </main>
  );
}
