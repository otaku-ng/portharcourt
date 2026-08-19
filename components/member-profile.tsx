import Link from "next/link";
import type { MemberProfile } from "@/lib/profiles/repository";
import { button, displayHeading, kicker, shell, textLink } from "@/lib/tailwind";
import { MemberAvatar } from "@/components/member-avatar";
import { Passport } from "@/components/passport";

const joinedDateFormatter = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

export function MemberProfileView({ profile, own = false }: { profile: MemberProfile; own?: boolean }) {
  const upcoming = profile.events.filter((event) => event.upcoming);
  const past = profile.events.filter((event) => !event.upcoming);
  const image = profile.avatarUrl ?? profile.image;
  const currentItems = [
    ["Watching", profile.currentlyWatching],
    ["Reading", profile.currentlyReading],
    ["Playing", profile.currentlyPlaying],
  ] as const;
  const favouriteItems = [
    ["Favourite anime", profile.favouriteAnime],
    ["Favourite manga", profile.favouriteManga],
    ["Favourite games", profile.favouriteGames],
  ] as const;
  const socialLinks = [
    { label: "Instagram", url: profile.instagramUrl },
    { label: "TikTok", url: profile.tiktokUrl },
    { label: "X / Twitter", url: profile.twitterUrl },
    { label: "YouTube", url: profile.youtubeUrl },
    { label: "Twitch", url: profile.twitchUrl },
    { label: "Website", url: profile.websiteUrl },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));

  return (
    <main className="overflow-hidden">
      <section className={`${shell} pb-[clamp(65px,9vw,110px)] pt-[clamp(45px,6vw,80px)]`}>
        {profile.bannerUrl ? <div aria-label={`${profile.displayName}'s profile banner`} className="h-[clamp(180px,28vw,360px)] overflow-hidden bg-brand-paper-dark bg-cover bg-center" role="img" style={{ backgroundImage: `url("${profile.bannerUrl}")` }} /> : null}
        <div className={`${profile.bannerUrl ? "mt-[-42px] pt-14" : "pt-2"} flex flex-wrap items-end justify-between gap-8 border-b border-[var(--line)] pb-10`}>
          <div className="flex items-center gap-6 max-[560px]:items-start max-[560px]:gap-4">
            <MemberAvatar name={profile.displayName} image={image} />
            <div>
              <p className={kicker}><span className="text-brand-red">Member profile</span> PH Otakus</p>
              <h1 className={`${displayHeading} mt-4 text-[clamp(3.6rem,8vw,8rem)]`}>{profile.displayName}</h1>
              <p className="mt-3 text-sm font-black tracking-[0.08em] uppercase">@{profile.username}</p>
            </div>
          </div>
          {own ? <div className="flex flex-wrap gap-3"><Link className={`${button} bg-brand-red text-white hover:bg-brand-coral`} href="/profile/edit">Edit profile <span>↗</span></Link><Link className={`${button} border-brand-ink hover:bg-brand-ink hover:text-white`} href={`/members/${profile.username}`}>Public view <span>↗</span></Link></div> : null}
        </div>

        <div className="mt-12 grid grid-cols-[1.05fr_0.95fr] gap-[9vw] max-[820px]:grid-cols-1 max-[820px]:gap-14">
          <div>
            <p className={kicker}>About the member</p>
            {profile.bio ? <p className="mt-5 max-w-[620px] text-[1.08rem] leading-[1.65]">{profile.bio}</p> : null}
            <dl className="mt-8 grid gap-4 border-t border-[var(--line)] pt-5 text-sm sm:grid-cols-2">
              <div><dt className={kicker}>Joined</dt><dd className="mt-1">{joinedDateFormatter.format(profile.joinedAt)}</dd></div>
              {profile.city ? <div><dt className={kicker}>Based in</dt><dd className="mt-1">{profile.city}</dd></div> : null}
              {profile.creatorType ? <div><dt className={kicker}>Creates as</dt><dd className="mt-1">{profile.creatorType}</dd></div> : null}
            </dl>
          </div>

          {profile.interests.length > 0 || favouriteItems.some(([, value]) => Boolean(value)) ? <div><p className={kicker}>Into right now</p>{profile.interests.length > 0 ? <div className="mt-5 flex flex-wrap gap-2">{profile.interests.map((interest) => <span className="border border-brand-ink px-3 py-2 text-[0.7rem] font-black tracking-[0.08em] uppercase" key={interest}>{interest}</span>)}</div> : null}<dl className="mt-8 grid gap-4 border-t border-[var(--line)] pt-5 text-sm">{favouriteItems.map(([label, value]) => value ? <div key={label}><dt className={kicker}>{label}</dt><dd className="mt-1">{value}</dd></div> : null)}</dl></div> : null}
        </div>

        {currentItems.some(([, value]) => Boolean(value)) ? <div className="mt-14 border-t border-[var(--line)] pt-8"><p className={kicker}>Currently</p><div className="mt-5 grid gap-5 sm:grid-cols-3">{currentItems.map(([label, value]) => value ? <div className="border-l-4 border-brand-blue pl-4" key={label}><p className={kicker}>{label}</p><p className="mt-2 text-lg font-black">{value}</p></div> : null)}</div></div> : null}

        {socialLinks.length > 0 ? <div className="mt-14 border-t border-[var(--line)] pt-8"><p className={kicker}>Find them elsewhere</p><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">{socialLinks.map(({ label, url }) => <a className="border-b-2 border-current pb-1 text-[0.75rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" href={url} key={label} rel="noopener noreferrer" target="_blank">{label} ↗</a>)}</div></div> : null}
      </section>

      <section className={`${shell} border-t border-[var(--line)] py-[clamp(70px,9vw,120px)]`} aria-labelledby="activity-heading">
        <div className="grid grid-cols-[0.7fr_1.3fr] gap-[7vw] max-[820px]:grid-cols-1 max-[820px]:gap-8">
          <p className={kicker}>Showing up in real life</p>
          <div><h2 className={`${displayHeading} text-[clamp(3rem,6vw,6.2rem)]`} id="activity-heading">Event activity</h2><div className="mt-10 grid gap-12 md:grid-cols-2"><EventList heading="Going to" events={upcoming} empty="No upcoming RSVPs yet." /><EventList heading="Previously attended" events={past} empty="No past event history yet." /></div></div>
        </div>
      </section>

      <section className={`${shell} mb-[clamp(90px,11vw,150px)]`}><Passport badges={profile.badges} /></section>
    </main>
  );
}

function EventList({ heading, events, empty }: { heading: string; events: MemberProfile["events"]; empty: string }) {
  return <div><h3 className="font-display text-[2rem] uppercase leading-none">{heading}</h3>{events.length > 0 ? <div className="mt-5 grid gap-4">{events.map((event) => <article className="border-t border-[var(--line)] pt-4" key={event.slug}><Link className="font-black hover:text-brand-red" href={`/events/${event.slug}`}>{event.title} <span aria-hidden="true">↗</span></Link><p className="mt-1 text-sm text-brand-ink-soft">{event.date} · {[event.venue, event.location].filter(Boolean).join(", ")}</p></article>)}</div> : <p className="mt-5 border-t border-[var(--line)] pt-4 text-sm text-brand-ink-soft">{empty}</p>}<Link className={`${textLink} mt-6`} href="/events">See events <span>↗</span></Link></div>;
}
