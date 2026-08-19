import { randomUUID } from "node:crypto";
import Link from "next/link";
import { AdminStoryForm, type AdminStoryFormData } from "@/components/admin-story-form";
import { createStoryAction } from "@/lib/stories/actions";

const initialStory = (uploadId: string): AdminStoryFormData => ({ uploadId, title: "", slug: "", category: "Anime", excerpt: "", content: "", coverImageUrl: "", coverImageKey: "", coverImageAlt: "", published: false });

export default function NewAdminStoryPage() {
  return <NewAdminStoryContent uploadId={randomUUID()} />;
}

function NewAdminStoryContent({ uploadId }: { uploadId: string }) {
  return (
    <section>
      <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase hover:text-brand-red" href="/admin/stories">← Back to stories</Link>
      <p className="mt-12 text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">New story</p>
      <h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">Write a story.</h1>
      <p className="mt-5 max-w-[620px] text-brand-ink-soft">Use Markdown for the body. Save a draft while the idea is taking shape, or publish it when it is ready for the community.</p>
      <div className="mt-12 max-w-[980px]"><AdminStoryForm action={createStoryAction} initial={initialStory(uploadId)} /></div>
    </section>
  );
}
