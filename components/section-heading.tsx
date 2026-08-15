import Link from "next/link";
import { displayHeading, kicker as kickerClass, textLink } from "@/lib/tailwind";

type SectionHeadingProps = {
  kicker: string;
  title: string;
  accent?: string;
  copy?: string;
  href?: string;
  linkLabel?: string;
  light?: boolean;
};

export function SectionHeading({ kicker, title, accent, copy, href, linkLabel, light = false }: SectionHeadingProps) {
  return (
    <div className={`grid grid-cols-[1fr_minmax(220px,0.42fr)_auto] items-end gap-[42px] border-t border-[var(--line)] pt-6 max-[820px]:grid-cols-1 max-[820px]:items-start ${light ? "border-white/20 text-white [&_.section-copy]:text-white [&_h2_em]:text-brand-blue" : ""}`}>
      <div>
        <p className={`${kickerClass} mb-7`}>{kicker}</p>
        <h2 className={`${displayHeading} text-[clamp(3.1rem,6.5vw,6.8rem)]`}>{title}{accent ? <> <em className="font-inherit not-italic text-brand-red">{accent}</em></> : null}</h2>
      </div>
      {copy ? <p className="section-copy max-w-[420px]">{copy}</p> : null}
      {href && linkLabel ? <Link className={`${textLink} max-[820px]:justify-self-start`} href={href}>{linkLabel} <span>↗</span></Link> : null}
    </div>
  );
}
