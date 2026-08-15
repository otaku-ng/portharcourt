import Link from "next/link";
import { navigation } from "@/lib/site-data";
import { Logo } from "./logo";
import { WhatsAppLink } from "./whatsapp-link";

export function SiteFooter() {
  return (
    <footer className="bg-brand-ink px-[max(32px,calc((100vw-min(1240px,calc(100vw-64px)))/2))] pb-6 pt-[72px] text-white">
      <div className="grid grid-cols-[1.5fr_0.5fr_0.6fr] gap-[10vw] pb-[70px] max-[820px]:grid-cols-2 max-[820px]:[&>div:first-child]:col-span-2 max-[560px]:grid-cols-1 max-[560px]:[&>div:first-child]:col-span-1">
        <div>
          <Logo inverse />
          <p className="mt-[26px] max-w-[380px] text-[0.86rem] text-white/68">
            Anime, manga, gaming, cosplay and creative culture—made in Port
            Harcourt.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <span className="mb-1.5 text-[0.64rem] font-black tracking-[0.14em] text-brand-blue uppercase">Explore</span>
          {navigation.map((item) => (
            <Link className="w-fit text-[0.78rem] transition-colors duration-[180ms] hover:text-brand-orange" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          <span className="mb-1.5 text-[0.64rem] font-black tracking-[0.14em] text-brand-blue uppercase">Say hello</span>
          <WhatsAppLink className="w-fit text-[0.78rem] transition-colors duration-[180ms] hover:text-brand-orange">Join the WhatsApp group</WhatsAppLink>
          <a className="w-fit text-[0.78rem] transition-colors duration-[180ms] hover:text-brand-orange" href="mailto:ph@otaku.ng">Email the community</a>
          <Link className="w-fit text-[0.78rem] transition-colors duration-[180ms] hover:text-brand-orange" href="/events">See what&apos;s on</Link>
          <Link className="w-fit text-[0.78rem] transition-colors duration-[180ms] hover:text-brand-orange" href="/community#join">Become a member</Link>
        </div>
      </div>
      <div className="flex justify-between border-t border-white/16 pt-5 text-[0.58rem] font-extrabold tracking-[0.12em] uppercase max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-2">
        <span>© 2026 PH Otakus</span>
        <span>4.8156° N · 7.0498° E</span>
        <span>Built for the culture in PH.</span>
      </div>
    </footer>
  );
}
