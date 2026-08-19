import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminGalleryForm, type AdminGalleryFormData } from "@/components/admin-gallery-form";
import { setGalleryPublishedAction, updateGalleryAlbumAction } from "@/lib/gallery/actions";
import { formatDateInput } from "@/lib/gallery/validation";
import { getAdminGalleryAlbumById, getGalleryEventOptions } from "@/lib/gallery/repository";

export default async function EditAdminGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [album, events] = await Promise.all([getAdminGalleryAlbumById(id), getGalleryEventOptions()]);
  if (!album) notFound();

  const initial: AdminGalleryFormData = {
    id: album.id,
    title: album.title,
    slug: album.slug,
    description: album.description ?? "",
    eventId: album.eventId ?? "",
    date: formatDateInput(album.date),
    published: album.published,
    images: album.images.map((image) => ({ clientId: image.id, id: image.id, objectKey: image.objectKey ?? undefined, url: image.url, alt: image.alt, caption: image.caption ?? "" })),
  };

  return (
    <section>
      <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase hover:text-brand-red" href="/admin/gallery">← Back to gallery</Link>
      <div className="mt-12 flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">Edit album</p><h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">{album.title}</h1></div>
        <div className="flex flex-wrap items-center gap-4 text-[0.7rem] font-black tracking-[0.08em] uppercase">
          {album.published ? <Link className="border-b-2 border-current pb-1 hover:text-brand-red" href={`/gallery/${album.slug}`} target="_blank">View public ↗</Link> : null}
          <form action={setGalleryPublishedAction}><input name="id" type="hidden" value={album.id} /><input name="published" type="hidden" value={album.published ? "false" : "true"} /><input name="returnTo" type="hidden" value={`/admin/gallery/${album.id}`} /><button className="border-b-2 border-current pb-1 hover:text-brand-red" type="submit">{album.published ? "Unpublish" : "Publish"}</button></form>
        </div>
      </div>
      <p className="mt-5 max-w-[620px] text-brand-ink-soft">Uploaded objects stay in R2 when removed or replaced in this phase. Use alt text for every image and captions only when they add context.</p>
      <div className="mt-12 max-w-[980px]"><AdminGalleryForm action={updateGalleryAlbumAction} events={events} initial={initial} /></div>
    </section>
  );
}
