import Link from "next/link";
import { navigation } from "@/lib/site-data";
import { Logo } from "./logo";
import { WhatsAppLink } from "./whatsapp-link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
        <WhatsAppLink
          className="button button-outline header-cta"
          fallback={<Link className="button button-outline header-cta" href="/community#join">Join the crew <span>↗</span></Link>}
        >
          Join WhatsApp <span>↗</span>
        </WhatsAppLink>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            <Link href="/">Home</Link>
            {navigation.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
            <WhatsAppLink
              className="button button-red"
              fallback={<Link className="button button-red" href="/community#join">Join the crew <span>↗</span></Link>}
            >
              Join WhatsApp <span>↗</span>
            </WhatsAppLink>
          </nav>
        </details>
      </div>
    </header>
  );
}
