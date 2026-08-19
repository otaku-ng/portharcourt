import Link from "next/link";
import { setGalleryPublishedAction } from "@/lib/gallery/actions";
import { getAdminGalleryAlbums } from "@/lib/gallery/repository";

export default async function AdminGalleryPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, albums] = await Promise.all([searchParams, getAdminGalleryAlbums()]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">Gallery desk</p>
          <h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">Manage gallery.</h1>
          <p className="mt-5 max-w-[520px] text-brand-ink-soft">Build image albums, add captions and publish the visual archive when it is ready.</p>
        </div>
        <Link className="inline-flex min-h-12 items-center justify-center bg-brand-red px-5 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase hover:bg-brand-coral" href="/admin/gallery/new">Create album <span className="ml-6">↗</span></Link>
      </div>

      {error === "publication" ? <p className="mt-6 text-sm text-brand-red" role="alert">The publication state could not be updated.</p> : null}

      <div className="mt-12 overflow-hidden border-y border-[var(--line)]">
        {albums.length === 0 ? <div className="py-12 text-brand-ink-soft">No gallery albums yet. Create the first one to get started.</div> : (
          <div className="divide-y divide-[var(--line)]">
            {albums.map((album) => (
              <article className="grid gap-5 py-6 md:grid-cols-[minmax(0,1.6fr)_0.65fr_0.8fr_auto] md:items-center" key={album.id}>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-[0.68rem] font-black tracking-[0.12em] uppercase ${album.published ? "text-brand-blue" : "text-brand-ink-soft"}`}>{album.published ? "Published" : "Draft"}</span>
                    <span className="text-[0.68rem] font-black tracking-[0.12em] text-brand-red uppercase">{album.imageCount} {album.imageCount === 1 ? "image" : "images"}</span>
                  </div>
                  <h2 className="mt-2 font-display text-[clamp(1.8rem,3vw,3rem)] font-bold leading-[0.9] uppercase"><Link className="hover:text-brand-red" href={`/admin/gallery/${album.id}`}>{album.title}</Link></h2>
                  <p className="mt-2 text-sm text-brand-ink-soft">/{album.slug}{album.event ? ` · ${album.event.title}` : ""}</p>
                </div>
                <div className="text-sm"><p className="text-[0.65rem] font-black tracking-[0.12em] uppercase">Event</p><p className="mt-1 text-brand-ink-soft">{album.event?.title ?? "None"}</p></div>
                <div className="text-sm"><p className="text-[0.65rem] font-black tracking-[0.12em] uppercase">Updated</p><p className="mt-1">{album.updatedAt.toLocaleDateString("en-GB")}</p><p className="mt-1 text-brand-ink-soft">{album.date?.toLocaleDateString("en-GB") ?? "Date not set"}</p></div>
                <div className="flex flex-wrap items-center gap-4 text-[0.7rem] font-black tracking-[0.08em] uppercase">
                  <Link className="border-b-2 border-current pb-1 hover:text-brand-red" href={`/admin/gallery/${album.id}`}>Edit</Link>
                  {album.published ? <Link className="border-b-2 border-current pb-1 hover:text-brand-red" href={`/gallery/${album.slug}`} target="_blank">View public ↗</Link> : null}
                  <form action={setGalleryPublishedAction}><input name="id" type="hidden" value={album.id} /><input name="published" type="hidden" value={album.published ? "false" : "true"} /><input name="returnTo" type="hidden" value="/admin/gallery" /><button className="border-b-2 border-current pb-1 hover:text-brand-red" type="submit">{album.published ? "Unpublish" : "Publish"}</button></form>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
