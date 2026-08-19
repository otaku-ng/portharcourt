import Link from "next/link";
import { AdminGalleryForm, type AdminGalleryFormData } from "@/components/admin-gallery-form";
import { createGalleryAlbumAction } from "@/lib/gallery/actions";
import { getGalleryEventOptions } from "@/lib/gallery/repository";

const initialAlbum: AdminGalleryFormData = {
  title: "",
  slug: "",
  description: "",
  eventId: "",
  date: "",
  published: false,
  images: [],
};

export default async function NewAdminGalleryPage() {
  const events = await getGalleryEventOptions();

  return (
    <section>
      <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase hover:text-brand-red" href="/admin/gallery">← Back to gallery</Link>
      <p className="mt-12 text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">New album</p>
      <h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">Create an album.</h1>
      <p className="mt-5 max-w-[620px] text-brand-ink-soft">Save the album first, then add multiple images and arrange them from the edit screen.</p>
      <div className="mt-12 max-w-[980px]"><AdminGalleryForm action={createGalleryAlbumAction} events={events} initial={initialAlbum} /></div>
    </section>
  );
}
