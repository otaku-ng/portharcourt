import Image from "next/image";
import Link from "next/link";
import type { StoryItem } from "@/lib/site-data";

export function StoryCard({ story, index }: { story: StoryItem; index: number }) {
  return (
    <article className="story-card">
      <Link className="story-image" href={`/blog#${story.slug}`}>
        <Image src={story.image} alt={story.alt} fill sizes="(max-width: 760px) 100vw, 34vw" />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </Link>
      <div className="story-body">
        <p className="card-eyebrow">{story.category} · {story.date}</p>
        <h3><Link href={`/blog#${story.slug}`}>{story.title}</Link></h3>
        <p>{story.excerpt}</p>
        <Link className="text-link" href={`/blog#${story.slug}`}>Read story <span>↗</span></Link>
      </div>
    </article>
  );
}
