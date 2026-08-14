import Image from "next/image";

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
    <section className="page-intro">
      <div className="page-intro-copy section-shell">
        <p className="kicker"><span>{index}</span> {eyebrow}</p>
        <h1>{title} <em>{accent}</em></h1>
        <p>{copy}</p>
      </div>
      <div className="page-intro-image">
        <Image src={image} alt={alt} fill priority sizes="100vw" style={{ objectPosition: imagePosition }} />
      </div>
    </section>
  );
}
