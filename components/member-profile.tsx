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

  return (
    <main className="overflow-hidden">
      <section className={`${shell} pb-[clamp(70px,9vw,120px)] pt-[clamp(55px,7vw,90px)]`}>
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-[var(--line)] pb-10">
          <div className="flex items-center gap-6 max-[560px]:items-start max-[560px]:gap-4">
            <MemberAvatar name={profile.displayName} image={image} />
            <div>
              <p className={kicker}><span className="text-brand-red">Member profile</span> PH Otakus</p>
              <h1 className={`${displayHeading} mt-4 text-[clamp(3.6rem,8vw,8rem)]`}>{profile.displayName}</h1>
              <p className="mt-3 text-sm font-black tracking-[0.08em] uppercase">@{profile.username}</p>
            </div>
          </div>
          {own ? (
            <div className="flex flex-wrap gap-3">
              <Link className={`${button} bg-brand-red text-white hover:bg-brand-coral`} href="/profile/edit">Edit profile <span>↗</span></Link>
              <Link className={`${button} border-brand-ink hover:bg-brand-ink hover:text-white`} href={`/members/${profile.username}`}>Public view <span>↗</span></Link>
            </div>
          ) : null}
        </div>

        <div className="mt-12 grid grid-cols-[1.05fr_0.95fr] gap-[9vw] max-[820px]:grid-cols-1 max-[820px]:gap-14">
          <div>
            <p className={kicker}>About the member</p>
            <p className="mt-5 max-w-[620px] text-[1.08rem] leading-[1.65]">{profile.bio || "Finding good stories, good games and good people in Port Harcourt."}</p>
            <dl className="mt-8 grid gap-4 border-t border-[var(--line)] pt-5 text-sm sm:grid-cols-2">
              <div><dt className={kicker}>Joined</dt><dd className="mt-1">{joinedDateFormatter.format(profile.joinedAt)}</dd></div>
              {profile.city ? <div><dt className={kicker}>Based in</dt><dd className="mt-1">{profile.city}</dd></div> : null}
              {profile.creatorType ? <div><dt className={kicker}>Creates as</dt><dd className="mt-1">{profile.creatorType}</dd></div> : null}
            </dl>
          </div>
          <div>
            <p className={kicker}>Into right now</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.interests.length > 0 ? profile.interests.map((interest) => <span className="border border-brand-ink px-3 py-2 text-[0.7rem] font-black tracking-[0.08em] uppercase" key={interest}>{interest}</span>) : <span className="text-sm text-brand-ink-soft">Interests coming soon.</span>}
            </div>
            <dl className="mt-8 grid gap-4 border-t border-[var(--line)] pt-5 text-sm">
              {profile.favouriteAnime ? <div><dt className={kicker}>Favourite anime</dt><dd className="mt-1">{profile.favouriteAnime}</dd></div> : null}
              {profile.favouriteManga ? <div><dt className={kicker}>Favourite manga</dt><dd className="mt-1">{profile.favouriteManga}</dd></div> : null}
              {profile.favouriteGames ? <div><dt className={kicker}>Favourite games</dt><dd className="mt-1">{profile.favouriteGames}</dd></div> : null}
            </dl>
          </div>
        </div>
      </section>

      <section className={`${shell} border-t border-[var(--line)] py-[clamp(70px,9vw,120px)]`} aria-labelledby="activity-heading">
        <div className="grid grid-cols-[0.7fr_1.3fr] gap-[7vw] max-[820px]:grid-cols-1 max-[820px]:gap-8">
          <p className={kicker}>Showing up in real life</p>
          <div>
            <h2 className={`${displayHeading} text-[clamp(3rem,6vw,6.2rem)]`} id="activity-heading">Event activity</h2>
            <div className="mt-10 grid gap-12 md:grid-cols-2">
              <EventList heading="Going to" events={upcoming} empty="No upcoming RSVPs yet." />
              <EventList heading="Previously attended" events={past} empty="No past event history yet." />
            </div>
          </div>
        </div>
      </section>

      <section className={`${shell} mb-[clamp(90px,11vw,150px)]`}>
        <Passport badges={profile.badges} />
      </section>
    </main>
  );
}

function EventList({ heading, events, empty }: { heading: string; events: MemberProfile["events"]; empty: string }) {
  return (
    <div>
      <h3 className="font-display text-[2rem] uppercase leading-none">{heading}</h3>
      {events.length > 0 ? (
        <div className="mt-5 grid gap-4">
          {events.map((event) => (
            <article className="border-t border-[var(--line)] pt-4" key={event.slug}>
              <Link className="font-black hover:text-brand-red" href={`/events/${event.slug}`}>{event.title} <span aria-hidden="true">↗</span></Link>
              <p className="mt-1 text-sm text-brand-ink-soft">{event.date} · {[event.venue, event.location].filter(Boolean).join(", ")}</p>
            </article>
          ))}
        </div>
      ) : <p className="mt-5 border-t border-[var(--line)] pt-4 text-sm text-brand-ink-soft">{empty}</p>}
      <Link className={`${textLink} mt-6`} href="/events">See events <span>↗</span></Link>
    </div>
  );
}
