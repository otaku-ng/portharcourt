import Link from "next/link";
import { setStoryPublishedAction } from "@/lib/stories/actions";
import { getAdminStories } from "@/lib/stories/repository";

export default async function AdminStoriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, stories] = await Promise.all([searchParams, getAdminStories()]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div><p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">Story desk</p><h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">Manage stories.</h1><p className="mt-5 max-w-[520px] text-brand-ink-soft">Write Markdown stories, keep drafts private and publish the notes worth sharing with the community.</p></div>
        <Link className="inline-flex min-h-12 items-center justify-center bg-brand-red px-5 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase hover:bg-brand-coral" href="/admin/stories/new">Create story <span className="ml-6">↗</span></Link>
      </div>
      {error === "publication" ? <p className="mt-6 text-sm text-brand-red" role="alert">The publication state could not be updated.</p> : null}
      <div className="mt-12 overflow-hidden border-y border-[var(--line)]">
        {stories.length === 0 ? <div className="py-12 text-brand-ink-soft">No stories yet. Create the first one to get started.</div> : (
          <div className="divide-y divide-[var(--line)]">
            {stories.map((story) => (
              <article className="grid gap-5 py-6 md:grid-cols-[minmax(0,1.6fr)_0.7fr_0.8fr_auto] md:items-center" key={story.id}>
                <div><div className="flex flex-wrap items-center gap-3"><span className="text-[0.68rem] font-black tracking-[0.12em] text-brand-red uppercase">{story.category}</span><span className={`text-[0.68rem] font-black tracking-[0.12em] uppercase ${story.status === "PUBLISHED" ? "text-brand-blue" : "text-brand-ink-soft"}`}>{story.status === "PUBLISHED" ? "Published" : "Draft"}</span></div><h2 className="mt-2 font-display text-[clamp(1.8rem,3vw,3rem)] font-bold leading-[0.9] uppercase"><Link className="hover:text-brand-red" href={`/admin/stories/${story.id}`}>{story.title}</Link></h2><p className="mt-2 text-sm text-brand-ink-soft">/{story.slug}</p></div>
                <div className="text-sm"><p className="text-[0.65rem] font-black tracking-[0.12em] uppercase">Published</p><p className="mt-1 text-brand-ink-soft">{story.publishedAt?.toLocaleDateString("en-GB") ?? "Not published"}</p></div>
                <div className="text-sm"><p className="text-[0.65rem] font-black tracking-[0.12em] uppercase">Updated</p><p className="mt-1">{story.updatedAt.toLocaleDateString("en-GB")}</p></div>
                <div className="flex flex-wrap items-center gap-4 text-[0.7rem] font-black tracking-[0.08em] uppercase"><Link className="border-b-2 border-current pb-1 hover:text-brand-red" href={`/admin/stories/${story.id}`}>Edit</Link>{story.status === "PUBLISHED" ? <Link className="border-b-2 border-current pb-1 hover:text-brand-red" href={`/blog/${story.slug}`} target="_blank">View public ↗</Link> : null}<form action={setStoryPublishedAction}><input name="id" type="hidden" value={story.id} /><input name="published" type="hidden" value={story.status === "PUBLISHED" ? "false" : "true"} /><input name="returnTo" type="hidden" value="/admin/stories" /><button className="border-b-2 border-current pb-1 hover:text-brand-red" type="submit">{story.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button></form></div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
