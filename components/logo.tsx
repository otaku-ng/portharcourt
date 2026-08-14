import Image from "next/image";
import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand ${inverse ? "brand-inverse" : ""}`} href="/" aria-label="PH Otakus home">
      <span className={`brand-mark ${inverse ? "brand-mark-inverse" : "brand-mark-primary"}`} aria-hidden="true">
        <Image
          src={inverse ? "/figma/ph-otakus-logo-inverse.svg" : "/figma/ph-otakus-logo-primary.png"}
          alt=""
          fill
          sizes="52px"
          priority
        />
      </span>
      <span className="brand-name">
        <b>PH OTAKUS</b>
        <small>Port Harcourt</small>
      </span>
    </Link>
  );
}
