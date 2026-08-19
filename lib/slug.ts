export function normalizeSlug(value: string | null | undefined, title: string): string {
  const source = (value || title).normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return source
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}
