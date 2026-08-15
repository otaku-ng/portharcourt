import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { PageIntro } from "@/components/page-intro";
import { gallery } from "@/lib/site-data";
import { button, displayHeading, kicker, sectionPadding, shell } from "@/lib/tailwind";

const galleryDesktop = [
  "col-span-7 row-start-1",
  "col-span-5 col-start-8 row-start-1",
  "col-span-4 col-start-1 row-span-2 row-start-2",
  "col-span-4 col-start-5 row-start-2",
  "col-span-4 col-start-9 row-start-2",
  "col-span-8 col-start-5 row-start-3",
];

const galleryTablet = [
  "max-[820px]:col-span-2 max-[820px]:row-start-1",
  "max-[820px]:col-span-1 max-[820px]:col-start-1 max-[820px]:row-start-2",
  "max-[820px]:col-span-1 max-[820px]:col-start-2 max-[820px]:row-start-2",
  "max-[820px]:col-span-1 max-[820px]:col-start-1 max-[820px]:row-start-3",
  "max-[820px]:col-span-1 max-[820px]:col-start-2 max-[820px]:row-start-3",
  "max-[820px]:hidden max-[560px]:block",
];

export const metadata: Metadata = {
  title: "Gallery",
  description: "The PH Otakus visual archive—community, events, collectibles and culture.",
};

export default function GalleryPage() {
  return (
    <main className="overflow-hidden">
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

      <section className={`${shell} ${sectionPadding}`}>
        <div className="mb-[70px] grid grid-cols-[1fr_0.6fr] gap-x-[8vw] gap-y-[30px] max-[820px]:grid-cols-1">
          <p className="col-span-2 max-[820px]:col-span-1"><span className={`${kicker} text-brand-red`}>Volume 01</span> <span className={kicker}>Scenes from the library</span></p>
          <h2 className={`${displayHeading} text-[clamp(3.1rem,6.5vw,6.8rem)]`}>Community is something you can <em className="font-inherit not-italic text-brand-red">see.</em></h2>
          <p className="self-end">These images come directly from the PH Otakus design library and the visual references that shaped it.</p>
        </div>
        <div className="grid grid-cols-12 grid-rows-[440px_280px_420px] gap-3.5 max-[820px]:grid-cols-2 max-[820px]:grid-rows-[380px_300px_420px] max-[560px]:block">
          {gallery.map((item, index) => (
            <figure className={`group relative overflow-hidden bg-brand-ink max-[560px]:block max-[560px]:h-[320px] ${galleryDesktop[index]} ${galleryTablet[index]} ${index > 0 ? "max-[560px]:mt-2.5" : ""}`} key={item.label}>
              <Image className="object-cover transition-transform duration-[420ms] group-hover:scale-[1.035]" src={item.image} alt={item.alt} fill sizes="(max-width: 760px) 100vw, 45vw" />
              <figcaption className="absolute bottom-3.5 left-3.5 flex items-center gap-3 bg-white px-3 py-2.5"><span className="font-display text-[1.6rem] text-brand-red">{String(index + 1).padStart(2, "0")}</span><div className="flex flex-col"><b className="text-[0.62rem] tracking-[0.1em] uppercase">{item.label}</b><small className="text-[0.62rem] tracking-[0.1em] text-[#6f6f6f] uppercase">{item.note}</small></div></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={`${shell} mb-[clamp(90px,11vw,150px)] grid grid-cols-[1fr_0.6fr_auto] items-center gap-12 bg-brand-blue p-[46px] max-[1100px]:grid-cols-[1fr_1.2fr] max-[1100px]:[&>p]:col-start-1 max-[1100px]:[&>.button]:col-start-1 max-[1100px]:[&>.button]:justify-self-start max-[560px]:grid-cols-1 max-[560px]:p-[30px]`}>
        <div>
          <p className={kicker}>Add to the archive</p>
          <h2 className={`${displayHeading} mt-3.5 text-[clamp(3rem,5vw,5.4rem)]`}>Were you there?</h2>
        </div>
        <p>Share your favourite PH Otakus photo, artwork or event memory for a future volume.</p>
        <Link className={`${button} bg-brand-red text-white hover:bg-brand-coral`} href="/contact">Send something in <span>↗</span></Link>
      </section>

      <Newsletter />
    </main>
  );
}
