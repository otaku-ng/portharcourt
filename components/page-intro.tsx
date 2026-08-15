import Image from "next/image";
import { displayHeading, kicker, shell } from "@/lib/tailwind";

type PageIntroProps = {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  copy: string;
  image: string;
  alt: string;
  imagePosition?: string;
};

export function PageIntro({ index, eyebrow, title, accent, copy, image, alt, imagePosition }: PageIntroProps) {
  return (
    <section className="relative grid min-h-[86svh] grid-cols-1 bg-brand-ink text-white max-[560px]:min-h-0">
      <div className={`${shell} relative z-2 grid grid-cols-[1.35fr_0.65fr] gap-x-[8vw] gap-y-6 pb-[54px] pt-[90px] max-[820px]:block max-[820px]:pb-11 max-[820px]:pt-[70px]`}>
        <p className={`${kicker} col-span-2 text-white max-[820px]:col-span-1`}><span className="text-brand-red">{index}</span> {eyebrow}</p>
        <h1 className={`${displayHeading} font-black tracking-[-0.03em] text-[clamp(4.4rem,9vw,9.5rem)] leading-[0.78] max-[820px]:mt-[22px] max-[560px]:text-[clamp(3.7rem,18vw,5.8rem)]`}>{title} <em className="font-inherit not-italic text-brand-blue">{accent}</em></h1>
        <p className="max-w-[430px] self-end text-base max-[820px]:mt-[30px]">{copy}</p>
      </div>
      <div className="relative h-[46svh] min-h-[360px] overflow-hidden after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(35,31,32,0.18),transparent_40%,rgba(35,31,32,0.35))] after:content-[''] max-[560px]:h-[360px] max-[560px]:min-h-0">
        <Image className="object-cover" src={image} alt={alt} fill priority sizes="100vw" style={{ objectPosition: imagePosition }} />
      </div>
    </section>
  );
}
