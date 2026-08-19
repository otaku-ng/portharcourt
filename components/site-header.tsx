import Link from "next/link";
import { navigation } from "@/lib/site-data";
import { getMember } from "@/lib/auth/member";
import { memberSignOutAction } from "@/lib/auth/member-actions";
import { MemberAvatar } from "@/components/member-avatar";
import { Logo } from "./logo";
import { WhatsAppLink } from "./whatsapp-link";
import { button } from "@/lib/tailwind";

export async function SiteHeader() {
  const member = await getMember();
  const memberName = member?.user.profile?.displayName ?? member?.user.name ?? "Member";
  const memberImage = member?.user.profile?.avatarUrl ?? member?.user.image;

  return (
    <header className="sticky top-0 z-[100] h-20 border-b border-[var(--line)] bg-[rgba(255,253,248,0.94)] backdrop-blur-[14px] max-[820px]:h-[70px]">
      <div className="mx-auto grid h-full w-[min(1240px,calc(100vw-64px))] grid-cols-[1fr_auto_1fr] items-center max-[1100px]:w-[min(calc(100%_-_40px),1080px)] max-[820px]:w-[calc(100vw_-_32px)] max-[820px]:grid-cols-[1fr_auto]">
        <Logo />
        <nav className="flex items-center gap-[30px] max-[1100px]:gap-[18px] max-[820px]:hidden" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link className="relative text-[0.73rem] font-black tracking-[0.08em] uppercase after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand-red after:content-[''] after:transition-transform after:duration-[180ms] after:ease-in-out hover:after:scale-x-100" href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="flex items-center justify-self-end gap-3 max-[820px]:hidden">
          {member ? <AccountMenu name={memberName} image={memberImage} profileCompleted={Boolean(member.user.profile?.profileCompleted)} /> : <Link className="border-b-2 border-current pb-1 text-[0.7rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" href="/signin">Sign in</Link>}
          <WhatsAppLink
            className={`${button} min-h-[42px] !border-brand-ink hover:bg-brand-ink hover:text-white max-[1100px]:gap-[14px]`}
            fallback={<Link className={`${button} min-h-[42px] !border-brand-ink hover:bg-brand-ink hover:text-white max-[1100px]:gap-[14px]`} href="/community#join">Join the crew <span>↗</span></Link>}
          >
            Join WhatsApp <span>↗</span>
          </WhatsAppLink>
        </div>
        <details className="relative hidden justify-self-end max-[820px]:block">
          <summary className="grid cursor-pointer list-none gap-1 p-3 [&::-webkit-details-marker]:hidden" aria-label="Open navigation"><span className="block h-0.5 w-[26px] bg-brand-ink" /><span className="block h-0.5 w-[26px] bg-brand-ink" /></summary>
          <nav className="absolute right-0 top-[52px] flex min-w-[240px] flex-col gap-1 border border-[var(--line)] bg-brand-paper p-[18px] shadow-[0_22px_60px_rgba(35,31,32,0.18)]" aria-label="Mobile navigation">
            <Link className="border-b border-[var(--line)] px-1 py-3 text-[0.8rem] font-black uppercase" href="/">Home</Link>
            {navigation.map((item) => (
              <Link className="border-b border-[var(--line)] px-1 py-3 text-[0.8rem] font-black uppercase" href={item.href} key={item.href}>{item.label}</Link>
            ))}
            {member ? <AccountMenu name={memberName} image={memberImage} profileCompleted={Boolean(member.user.profile?.profileCompleted)} mobile /> : <Link className="border-b border-[var(--line)] px-1 py-3 text-[0.8rem] font-black uppercase" href="/signin">Sign in</Link>}
            <WhatsAppLink
              className={`${button} bg-brand-red text-white hover:bg-brand-coral`}
              fallback={<Link className={`${button} bg-brand-red text-white hover:bg-brand-coral`} href="/community#join">Join the crew <span>↗</span></Link>}
            >
              Join WhatsApp <span>↗</span>
            </WhatsAppLink>
          </nav>
        </details>
      </div>
    </header>
  );
}

function AccountMenu({ name, image, profileCompleted, mobile = false }: { name: string; image?: string | null; profileCompleted: boolean; mobile?: boolean }) {
  return (
    <details className={`relative ${mobile ? "border-b border-[var(--line)] pb-2" : ""}`}>
      <summary className={`flex cursor-pointer list-none items-center gap-2 ${mobile ? "px-1 py-3 text-[0.8rem] font-black uppercase [&::-webkit-details-marker]:hidden" : "rounded-full [&::-webkit-details-marker]:hidden"}`} aria-label="Open account menu">
        {mobile ? <span>Account</span> : <MemberAvatar name={name} image={image} size="small" />}
        {!mobile ? <span className="sr-only">Open account menu</span> : <span aria-hidden="true">⌄</span>}
      </summary>
      <div className={`absolute right-0 top-[calc(100%+12px)] z-10 grid min-w-[190px] gap-1 border border-[var(--line)] bg-brand-paper p-3 shadow-[0_18px_45px_rgba(35,31,32,0.15)] ${mobile ? "static mt-2 shadow-none" : ""}`}>
        <Link className="px-2 py-2 text-[0.72rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" href={profileCompleted ? "/profile" : "/profile/setup"}>My profile</Link>
        {profileCompleted ? <Link className="px-2 py-2 text-[0.72rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" href="/profile/edit">Edit profile</Link> : null}
        <form action={memberSignOutAction}>
          <button className="w-full px-2 py-2 text-left text-[0.72rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" type="submit">Sign out</button>
        </form>
      </div>
    </details>
  );
}
