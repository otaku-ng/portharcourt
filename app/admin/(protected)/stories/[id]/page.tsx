import { randomUUID } from "node:crypto";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminStoryForm, type AdminStoryFormData } from "@/components/admin-story-form";
import { setStoryPublishedAction, updateStoryAction } from "@/lib/stories/actions";
import { getAdminStoryById } from "@/lib/stories/repository";

export default async function EditAdminStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getAdminStoryById(id);
  if (!story) notFound();

  const initial: AdminStoryFormData = { uploadId: randomUUID(), id: story.id, title: story.title, slug: story.slug, category: story.category, excerpt: story.excerpt, content: story.content, coverImageUrl: story.coverImageUrl, coverImageKey: story.coverImageKey ?? "", coverImageAlt: story.coverImageAlt, published: story.status === "PUBLISHED" };

  return (
    <section>
      <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase hover:text-brand-red" href="/admin/stories">← Back to stories</Link>
      <div className="mt-12 flex flex-wrap items-end justify-between gap-5"><div><p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">Edit story</p><h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">{story.title}</h1></div><div className="flex flex-wrap items-center gap-4 text-[0.7rem] font-black tracking-[0.08em] uppercase">{story.status === "PUBLISHED" ? <Link className="border-b-2 border-current pb-1 hover:text-brand-red" href={`/blog/${story.slug}`} target="_blank">View public ↗</Link> : null}<form action={setStoryPublishedAction}><input name="id" type="hidden" value={story.id} /><input name="published" type="hidden" value={story.status === "PUBLISHED" ? "false" : "true"} /><input name="returnTo" type="hidden" value={`/admin/stories/${story.id}`} /><button className="border-b-2 border-current pb-1 hover:text-brand-red" type="submit">{story.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button></form></div></div>
      <p className="mt-5 max-w-[620px] text-brand-ink-soft">Cover replacements create a new R2 object; previous media is intentionally left untouched in this phase.</p>
      <div className="mt-12 max-w-[980px]"><AdminStoryForm action={updateStoryAction} initial={initial} /></div>
    </section>
  );
}
