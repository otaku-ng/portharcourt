import Image from "next/image";
import Link from "next/link";
import type { StorySummary } from "@/lib/stories/types";
import { cardEyebrow, textLink } from "@/lib/tailwind";

export function StoryCard({ story, index }: { story: StorySummary; index: number }) {
  return (
    <article className="group border-t border-[var(--line)]">
      <Link className="relative block h-[330px] overflow-hidden max-[560px]:h-[290px]" href={`/blog/${story.slug}`}>
        <Image className="object-cover transition-transform duration-[420ms] ease-in-out group-hover:scale-[1.045]" src={story.image} alt={story.alt} fill sizes="(max-width: 760px) 100vw, 34vw" />
        <span className="absolute bottom-0 right-0 bg-brand-orange px-2.5 pb-[5px] pt-2 font-display text-[1.5rem]">{String(index + 1).padStart(2, "0")}</span>
      </Link>
      <div className="pt-[22px]">
        <p className={cardEyebrow}>{story.category} · {story.date}</p>
        <h3 className="mt-2.5 font-display text-[clamp(1.9rem,3vw,3rem)] font-bold tracking-[-0.01em] leading-[0.95] uppercase"><Link href={`/blog/${story.slug}`}>{story.title}</Link></h3>
        <p className="mt-3.5 text-[0.9rem] text-brand-ink-soft">{story.excerpt}</p>
        <Link className={`${textLink} mt-[22px]`} href={`/blog/${story.slug}`}>Read story <span>↗</span></Link>
      </div>
    </article>
  );
}
