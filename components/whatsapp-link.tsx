import type { AnchorHTMLAttributes, ReactNode } from "react";

type WhatsAppLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  children: ReactNode;
  fallback?: ReactNode;
};

const defaultWhatsAppGroupUrl =
  "https://chat.whatsapp.com/C9ejyNTEYdpJ7xv7AETRXz?s=cl&p=i&ilr=4&amv=1";

function getWhatsAppGroupUrl() {
  const url =
    process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL?.trim() ||
    defaultWhatsAppGroupUrl;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === "chat.whatsapp.com"
      ? parsedUrl.toString()
      : null;
  } catch {
    return null;
  }
}

export function WhatsAppLink({ children, fallback = null, ...props }: WhatsAppLinkProps) {
  const href = getWhatsAppGroupUrl();

  if (!href) return fallback;

  return (
    <a href={href} rel="noreferrer" target="_blank" {...props}>
      {children}
    </a>
  );
}
