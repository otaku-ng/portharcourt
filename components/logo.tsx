import Image from "next/image";
import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      className="inline-flex w-fit items-center gap-2.5 justify-self-start"
      href="/"
      aria-label="PH Otakus home"
    >
      <span
        className="relative block h-12 w-[48px] overflow-hidden max-[820px]:h-[40px] max-[820px]:w-[40px]"
        aria-hidden="true"
      >
        <Image
          src={
            inverse
              ? "/figma/ph-otakus-logo-inverse.svg"
              : "/figma/ph-otakus-logo-primary.svg"
          }
          alt=""
          fill
          sizes="48px"
          priority
          className="object-contain"
        />
      </span>
      <span className="flex flex-col leading-none">
        <b className="font-display text-[1.28rem] tracking-[0.055em] max-[820px]:text-[1.04rem]">
          PH OTAKUS
        </b>
      </span>
    </Link>
  );
}
