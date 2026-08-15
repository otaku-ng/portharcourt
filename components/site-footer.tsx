import Link from "next/link";
import { navigation } from "@/lib/site-data";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Logo inverse />
          <p>
            Anime, manga, gaming, cosplay and creative culture—made in Port
            Harcourt.
          </p>
        </div>
        <div className="footer-nav">
          <span>Explore</span>
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="footer-nav">
          <span>Say hello</span>
          <a href="mailto:ph@otaku.ng">Email the community</a>
          <Link href="/events">See what&apos;s on</Link>
          <Link href="/community#join">Become a member</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 PH Otakus</span>
        <span>4.8156° N · 7.0498° E</span>
        <span>Built for the culture in PH.</span>
      </div>
    </footer>
  );
}
