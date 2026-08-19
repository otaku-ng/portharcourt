import Link from "next/link";
import type { PublicMember } from "@/lib/members/repository";
import { MemberAvatar } from "@/components/member-avatar";
import { kicker } from "@/lib/tailwind";

export function MemberCard({ member }: { member: PublicMember }) {
  const visibleInterests = member.interests.slice(0, 3);
  const remainingInterests = member.interests.length - visibleInterests.length;

  return (
    <article className="group flex min-h-[340px] flex-col border border-[var(--line)] bg-brand-paper p-6 transition-[background,transform] duration-[180ms] ease-in-out hover:-translate-y-1 hover:bg-brand-blue-soft max-[560px]:min-h-0">
      <Link className="flex h-full flex-col" href={`/members/${member.username}`} aria-label={`View ${member.displayName}'s public profile`}>
        <div className="flex items-start justify-between gap-5">
          <MemberAvatar name={member.displayName} image={member.image} />
          <span className="font-display text-[2rem] leading-none text-brand-red transition-transform duration-[180ms] group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</span>
        </div>

        <div className="mt-7">
          <p className={`${kicker} text-brand-red`}>{member.creatorType ? "Creator" : "Community member"}</p>
          <h2 className="mt-2 font-display text-[clamp(2.3rem,3.4vw,3.8rem)] uppercase leading-[0.88]">{member.displayName}</h2>
          <p className="mt-2 text-sm font-black tracking-[0.08em] uppercase">@{member.username}</p>
        </div>

        <div className="mt-auto pt-7">
          <div className="flex flex-wrap gap-2">
            {member.creatorType ? <span className="border border-brand-ink bg-brand-orange px-2.5 py-1 text-[0.66rem] font-black tracking-[0.08em] uppercase">{member.creatorType}</span> : null}
            {visibleInterests.map((interest) => <span className="border border-[var(--line)] px-2.5 py-1 text-[0.66rem] font-black tracking-[0.08em] uppercase" key={interest}>{interest}</span>)}
            {remainingInterests > 0 ? <span className="px-1 py-1 text-[0.66rem] font-black tracking-[0.08em] uppercase text-brand-ink-soft">+{remainingInterests}</span> : null}
          </div>
          {member.city ? <p className="mt-4 text-sm text-brand-ink-soft">Based in {member.city}</p> : null}
          {member.bio ? <p className="mt-4 line-clamp-3 max-w-[38rem] text-sm leading-[1.55] text-brand-ink-soft">{member.bio}</p> : null}
        </div>
      </Link>
    </article>
  );
}

