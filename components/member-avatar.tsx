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
  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full border-2 border-brand-ink bg-brand-blue font-display text-brand-ink ${size === "small" ? "size-10 text-sm" : "size-28 text-3xl max-[560px]:size-24"}`}
      role={image ? "img" : undefined}
      aria-label={image ? `${name} avatar` : undefined}
      style={image ? { backgroundImage: `url("${image}")`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}
    >
      <span aria-hidden={Boolean(image)}>{getInitials(name)}</span>
    </div>
  );
}
