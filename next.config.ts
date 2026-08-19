import type { NextConfig } from "next";

function getR2RemotePattern() {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL?.trim();

  if (!baseUrl) return null;

  try {
    const url = new URL(baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    const pathname = url.pathname.replace(/\/$/, "");

    return {
      protocol: url.protocol.slice(0, -1) as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: `${pathname || ""}/**`,
    };
  } catch {
    return null;
  }
}

const r2RemotePattern = getR2RemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2RemotePattern ? [r2RemotePattern] : [],
  },
};

export default nextConfig;
