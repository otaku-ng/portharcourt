import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Newsletter } from "@/components/newsletter";
import { getPublishedGalleryAlbumBySlug } from "@/lib/gallery/repository";
import { button, displayHeading, kicker, sectionPadding, shell } from "@/lib/tailwind";

type GalleryDetailPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: GalleryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = await getPublishedGalleryAlbumBySlug(slug);
  if (!album) return { title: "Album not found", description: "The requested PH Otakus gallery album could not be found." };

  return {
    title: album.title,
    description: album.description ?? `Images from ${album.title}.`,
    openGraph: {
      title: album.title,
      description: album.description ?? `Images from ${album.title}.`,
      images: album.images[0] ? [{ url: album.images[0].url, alt: album.images[0].alt }] : undefined,
    },
  };
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const { slug } = await params;
  const album = await getPublishedGalleryAlbumBySlug(slug);
  if (!album) notFound();

  const date = album.date ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(album.date) : null;

  return (
    <main className="overflow-hidden">
      <section className={`${shell} ${sectionPadding}`}>
        <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase hover:text-brand-red" href="/gallery">← Back to gallery</Link>
        <div className="mt-14 grid grid-cols-[1.1fr_0.9fr] items-end gap-[8vw] max-[820px]:grid-cols-1 max-[820px]:gap-8">
          <div>
            <p className={kicker}><span className="text-brand-red">Gallery album</span>{date ? ` · ${date}` : ""}</p>
            <h1 className={`${displayHeading} mt-5 text-[clamp(4rem,8vw,8.4rem)] leading-[0.8] uppercase`}>{album.title}</h1>
          </div>
          <div>
            {album.description ? <p className="max-w-[520px] text-[1.05rem] leading-[1.6]">{album.description}</p> : null}
            {album.event ? <Link className={`${button} mt-7 bg-brand-red text-white hover:bg-brand-coral`} href={`/events/${album.event.slug}`}>View associated event <span>↗</span></Link> : null}
          </div>
        </div>
      </section>

      <section className={`${shell} pb-[clamp(100px,12vw,170px)]`}>
        {album.images.length === 0 ? (
          <p className="border-y border-[var(--line)] py-12 text-brand-ink-soft">This album does not have any published images yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
            {album.images.map((image, index) => (
              <figure className={`group ${index === 0 ? "col-span-2 max-[560px]:col-span-1" : ""}`} key={image.id}>
                <div className={`relative overflow-hidden bg-brand-ink ${index === 0 ? "h-[min(68vw,760px)] max-[560px]:h-[360px]" : "h-[min(42vw,520px)] max-[560px]:h-[320px]"}`}>
                  <Image className="object-cover transition-transform duration-[420ms] group-hover:scale-[1.02]" src={image.url} alt={image.alt} fill sizes={index === 0 ? "100vw" : "(max-width: 560px) 100vw, 50vw"} />
                </div>
                {image.caption ? <figcaption className="mt-3 text-[0.75rem] font-black tracking-[0.1em] uppercase">{image.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        )}
      </section>

      <Newsletter />
    </main>
  );
}
