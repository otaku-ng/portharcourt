import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { PageIntro } from "@/components/page-intro";
import { gallery } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "The PH Otakus visual archive—community, events, collectibles and culture.",
};

export default function GalleryPage() {
  return (
    <main>
      <PageIntro
        index="04"
        eyebrow="The visual archive"
        title="Proof that the"
        accent="culture is here."
        copy="A living collection of rooms, faces, objects and images that shape the PH Otakus story."
        image="/figma/home-08.jpg"
        alt="Kakashi collectible posed with electric blue lightning"
        imagePosition="center 38%"
      />

      <section className="gallery-page section-shell">
        <div className="gallery-page-intro">
          <p className="kicker"><span>Volume 01</span> Scenes from the library</p>
          <h2>Community is something you can <em>see.</em></h2>
          <p>These images come directly from the PH Otakus design library and the visual references that shaped it.</p>
        </div>
        <div className="gallery-masonry">
          {gallery.map((item, index) => (
            <figure className={`gallery-tile gallery-tile-${index + 1}`} key={item.label}>
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 760px) 100vw, 45vw" />
              <figcaption><span>{String(index + 1).padStart(2, "0")}</span><div><b>{item.label}</b><small>{item.note}</small></div></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="gallery-submit section-shell">
        <div>
          <p className="kicker">Add to the archive</p>
          <h2>Were you there?</h2>
        </div>
        <p>Share your favourite PH Otakus photo, artwork or event memory for a future volume.</p>
        <Link className="button button-red" href="/contact">Send something in <span>↗</span></Link>
      </section>

      <Newsletter />
    </main>
  );
}
