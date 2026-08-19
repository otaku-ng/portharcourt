"use client";

import Image from "next/image";
import { useState } from "react";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PH";
}

export function MemberAvatar({
  name,
  image,
  size = "large",
}: {
  name: string;
  image?: string | null;
  size?: "small" | "large";
}) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const showImage = Boolean(image) && failedImage !== image;

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full border-2 border-brand-ink bg-brand-blue font-display text-brand-ink ${size === "small" ? "size-10 text-sm" : "size-28 text-3xl max-[560px]:size-24"}`}
      role={showImage ? undefined : "img"}
      aria-label={showImage ? undefined : `${name} avatar`}
    >
      {showImage ? (
        <Image
          alt={`${name} avatar`}
          className="object-cover"
          fill
          onError={() => setFailedImage(image ?? null)}
          sizes={size === "small" ? "40px" : "112px"}
          src={image ?? ""}
          unoptimized
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </div>
  );
}
