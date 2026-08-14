import Link from "next/link";

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
    <div className={`section-heading ${light ? "section-heading-light" : ""}`}>
      <div>
        <p className="kicker">{kicker}</p>
        <h2>{title}{accent ? <> <em>{accent}</em></> : null}</h2>
      </div>
      {copy ? <p className="section-copy">{copy}</p> : null}
      {href && linkLabel ? <Link className="text-link" href={href}>{linkLabel} <span>↗</span></Link> : null}
    </div>
  );
}
