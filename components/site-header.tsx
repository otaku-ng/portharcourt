import Link from "next/link";
import { navigation } from "@/lib/site-data";
import { Logo } from "./logo";

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
        <Link className="button button-outline header-cta" href="/community#join">Join the crew <span>↗</span></Link>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            <Link href="/">Home</Link>
            {navigation.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
            <Link className="button button-red" href="/community#join">Join the crew <span>↗</span></Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
