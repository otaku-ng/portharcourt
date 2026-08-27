const localSiteOrigin = "http://localhost:3000";

function normalizeSiteOrigin(value: string | undefined): string | null {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    if ((url.protocol !== "http:" && url.protocol !== "https:") || url.username || url.password || url.search || url.hash) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Return the canonical site origin used by metadata, robots and the sitemap.
 * SITE_URL is authoritative in production; request headers are only a useful
 * development fallback for local proxies and alternate localhost ports.
 */
export function getSiteOrigin(requestHeaders?: Pick<Headers, "get">): string {
  const configuredOrigin = normalizeSiteOrigin(process.env.SITE_URL);
  if (configuredOrigin) return configuredOrigin;

  if (process.env.NODE_ENV !== "production" && requestHeaders) {
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
    const requestOrigin = normalizeSiteOrigin(host ? `${protocol}://${host}` : undefined);
    if (requestOrigin) return requestOrigin;
  }

  return localSiteOrigin;
}

export function getSiteUrl(path = ""): string {
  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${getSiteOrigin()}${normalizedPath}`;
}
