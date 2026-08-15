import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { Newsletter } from "@/components/newsletter";
import { SectionHeading } from "@/components/section-heading";
import { StoryCard } from "@/components/story-card";
import { communityLanes, events, gallery, stories } from "@/lib/site-data";
import {
  button,
  displayHeading,
  kicker,
  sectionPadding,
  shell,
  textLink,
} from "@/lib/tailwind";

const homeGalleryDesktop = [
  "col-span-6 row-start-1",
  "col-span-3 col-start-7 row-start-1",
  "col-span-3 col-start-10 row-span-2 row-start-1",
  "col-span-4 col-start-1 row-start-2",
  "col-span-5 col-start-5 row-start-2",
];

const homeGalleryTablet = [
  "max-[820px]:col-span-2 max-[820px]:row-start-1",
  "max-[820px]:col-span-1 max-[820px]:col-start-1 max-[820px]:row-start-2",
  "max-[820px]:col-span-1 max-[820px]:col-start-2 max-[820px]:row-start-2",
  "max-[820px]:col-span-1 max-[820px]:col-start-1 max-[820px]:row-start-3",
  "max-[820px]:col-span-1 max-[820px]:col-start-2 max-[820px]:row-start-3",
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="relative min-h-[calc(100svh-80px)] overflow-hidden bg-brand-blue text-white max-[820px]:min-h-[calc(100svh-70px)]">
        <div className="absolute inset-0 after:absolute after:inset-0 after:bg-[linear-gradient(90deg,rgba(35,31,32,0.95)_0%,rgba(35,31,32,0.65)_45%,rgba(35,31,32,0.24)_72%,rgba(0,174,239,0.55)_100%),linear-gradient(0deg,rgba(35,31,32,0.5),transparent_55%)] after:content-[''] max-[820px]:after:bg-[linear-gradient(90deg,rgba(35,31,32,0.94),rgba(35,31,32,0.5)),linear-gradient(0deg,rgba(35,31,32,0.4),transparent)]">
          <Image
            className="object-cover [object-position:center_43%]"
            src="/figma/home-05.jpg"
            alt="PH Otakus members celebrating together in Port Harcourt"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[length:72px_72px] [mask-image:linear-gradient(90deg,black,transparent_75%)]"
          aria-hidden="true"
        />
        <div
          className={`${shell} relative z-2 grid min-h-[calc(100svh-80px)] grid-cols-[minmax(0,1.55fr)_minmax(240px,0.55fr)] items-end pb-[clamp(68px,9vh,110px)] pt-[90px] max-[820px]:block max-[820px]:min-h-[calc(100svh-70px)] max-[820px]:pb-[42px] max-[820px]:pt-20`}
        >
          <div className="relative z-3 max-w-[830px] self-end">
            <p
              className={`${kicker} mb-6 text-white max-[560px]:max-w-[260px]`}
            >
              <span className="mr-3 inline-block bg-brand-red px-[9px] pb-1.5 pt-[7px] text-white">
                Est. in PH
              </span>{" "}
              Anime · Manga · Gaming · Cosplay
            </p>
            <h1 className="font-display text-[clamp(4.8rem,10vw,10.4rem)] font-black tracking-[-0.03em] leading-[0.85] uppercase max-[820px]:text-[clamp(4.6rem,17vw,8rem)] max-[560px]:text-[clamp(4rem,22vw,6.2rem)]">
              <span className="text-[0.48em] tracking-[0.02em]">For the</span>
              <br />{" "}
              <em className="font-inherit not-italic text-brand-blue">
                culture.
              </em>
              <br />
              For the{" "}
              <strong className="font-inherit text-brand-orange">crew.</strong>
            </h1>
            <p className="mt-7 max-w-[610px] text-[clamp(1rem,1.4vw,1.22rem)] leading-[1.6]">
              Port Harcourt&apos;s meeting point for people who love big
              stories, competitive games, brilliant costumes and finding their
              people.
            </p>
            <div className="mt-[34px] flex flex-wrap gap-3 max-[560px]:max-w-[290px] max-[560px]:flex-col max-[560px]:items-stretch">
              <Link
                className={`${button} bg-brand-red text-white hover:bg-brand-coral`}
                href="/community#join"
              >
                Join the community <span>↗</span>
              </Link>
              <Link
                className={`${button} bg-white text-brand-ink hover:bg-brand-blue`}
                href="/events"
              >
                Explore events <span>↓</span>
              </Link>
            </div>
          </div>
          <aside className="relative z-3 flex w-[min(100%,300px)] flex-col gap-3 justify-self-end bg-[rgba(255,255,255,0.94)] p-[22px] text-brand-ink max-[820px]:mt-[34px]">
            <span className="text-[0.67rem] font-black tracking-[0.13em] text-brand-red uppercase">
              Next signal
            </span>
            <b className="text-[1.15rem] leading-[1.18]">
              The next community session
            </b>
            <small className="text-[0.67rem] font-black tracking-[0.13em] uppercase">
              Date and venue announcement soon
            </small>
            <Link
              className="flex items-center justify-between border-t border-[var(--line)] pt-3 text-[0.72rem] font-black uppercase"
              href="/events"
            >
              Keep watch <span>↗</span>
            </Link>
          </aside>
          <div
            className="pointer-events-none absolute bottom-[-9%] right-[17%] z-1 h-[min(65vw,660px)] w-[min(47vw,550px)] max-[1100px]:right-[8%] max-[820px]:bottom-[-2%] max-[820px]:right-[-8%] max-[820px]:h-[47vw] max-[820px]:w-[42vw] max-[560px]:bottom-[-1%] max-[560px]:right-[-15%] max-[560px]:h-[53vw] max-[560px]:w-[50vw]"
            aria-hidden="true"
          >
            <Image
              className="object-contain [object-position:bottom_center] [filter:drop-shadow(0_18px_30px_rgba(0,0,0,0.28))]"
              src="/figma/home-01.png"
              alt=""
              fill
              sizes="(max-width: 800px) 60vw, 32vw"
            />
          </div>
        </div>
        <div
          className="absolute bottom-[18px] right-6 z-3 text-right text-[0.58rem] font-black tracking-[0.16em] leading-[1.5] uppercase max-[560px]:hidden"
          aria-hidden="true"
        >
          4.8156° N<br />
          7.0498° E
        </div>
      </section>

      <div
        className="overflow-hidden bg-brand-red py-[13px] pb-[11px] text-white"
        aria-label="Community interests"
      >
        <div className="flex w-max animate-ticker items-center gap-[30px] [&_i]:text-brand-orange [&_i]:not-italic [&_span]:font-display [&_span]:text-[1.2rem] [&_span]:tracking-[0.07em]">
          <span>ANIME</span>
          <i>✦</i>
          <span>MANGA</span>
          <i>✦</i>
          <span>GAMING</span>
          <i>✦</i>
          <span>COSPLAY</span>
          <i>✦</i>
          <span>PORT HARCOURT</span>
          <i>✦</i>
          <span>ANIME</span>
          <i>✦</i>
          <span>MANGA</span>
          <i>✦</i>
          <span>GAMING</span>
          <i>✦</i>
          <span>COSPLAY</span>
          <i>✦</i>
          <span>PORT HARCOURT</span>
          <i>✦</i>
        </div>
      </div>

      <section className={`${shell} ${sectionPadding}`}>
        <p className={kicker}>
          <span className="text-brand-red">01</span> Our city. Our community.
        </p>
        <div className="mt-[30px] grid grid-cols-[1.25fr_0.75fr] items-start gap-[10vw] max-[820px]:grid-cols-1 max-[820px]:gap-9">
          <h2 className={`${displayHeading} text-[clamp(3.1rem,6.5vw,6.8rem)]`}>
            Built in Port Harcourt.
            <br />
            <em className="font-inherit not-italic text-brand-red">
              Connected by fandom.
            </em>
          </h2>
          <div>
            <p>
              PH Otakus brings together anime fans, gamers, cosplayers, artists
              and creators through meetups, watch parties, tournaments and
              shared experiences.
            </p>
            <p className="mt-[18px]">
              Come exactly as you are. There is room for the lifelong fan, the
              curious newcomer and everyone in between.
            </p>
            <Link className={`${textLink} mt-7`} href="/community">
              Meet the community <span>↗</span>
            </Link>
          </div>
        </div>
        <div className="mt-[84px] grid grid-cols-3 border-y border-[var(--line)] max-[560px]:grid-cols-1">
          <div className="flex items-end gap-4 px-[22px] py-[26px]">
            <strong className="font-display text-[4rem] leading-[0.75] text-brand-blue">
              01
            </strong>
            <span className="text-[0.68rem] font-black tracking-[0.14em] uppercase">
              City
            </span>
          </div>
          <div className="flex items-end gap-4 border-l border-[var(--line)] px-[22px] py-[26px] max-[560px]:border-l-0 max-[560px]:border-t">
            <strong className="font-display text-[4rem] leading-[0.75] text-brand-blue">
              04
            </strong>
            <span className="text-[0.68rem] font-black tracking-[0.14em] uppercase">
              Core lanes
            </span>
          </div>
          <div className="flex items-end gap-4 border-l border-[var(--line)] px-[22px] py-[26px] max-[560px]:border-l-0 max-[560px]:border-t">
            <strong className="font-display text-[4rem] leading-[0.75] text-brand-blue">
              ∞
            </strong>
            <span className="text-[0.68rem] font-black tracking-[0.14em] uppercase">
              Things to obsess over
            </span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-brand-blue py-[clamp(80px,10vw,140px)]">
        <div className={shell}>
          <div>
            <p className={`${kicker} mb-7`}>
              <span className="text-brand-ink">From the library</span> The
              visual world
            </p>
            <h2
              className={`${displayHeading} text-[clamp(3.1rem,6.5vw,6.8rem)]`}
            >
              Panels, people and
              <br />
              <em className="font-inherit not-italic text-white">
                Port Harcourt energy.
              </em>
            </h2>
          </div>
        </div>
        <div
          className={`${shell} mt-[60px] grid grid-cols-[1.45fr_0.75fr] grid-rows-[330px_220px] gap-[18px] max-[820px]:grid-cols-2 max-[820px]:grid-rows-[430px_260px] max-[560px]:block`}
        >
          <figure className="group relative row-span-2 overflow-hidden bg-brand-ink max-[820px]:col-span-2 max-[820px]:row-span-1 max-[560px]:h-[300px]">
            <Image
              className="object-cover transition-transform duration-[420ms] group-hover:scale-[1.035]"
              src="/figma/event-01.jpg"
              alt="Colourful vintage comic book covers"
              fill
              sizes="(max-width: 800px) 100vw, 58vw"
            />
            <figcaption className="absolute bottom-[18px] left-[18px] flex items-center justify-between gap-5 bg-white px-3 py-2.5 text-[0.7rem] font-black tracking-[0.1em] uppercase">
              <span>Comic culture</span>
              <span className="text-brand-red">01</span>
            </figcaption>
          </figure>
          <figure className="group relative overflow-hidden bg-brand-ink max-[820px]:row-start-2 max-[560px]:mt-3 max-[560px]:h-[300px]">
            <Image
              className="object-cover transition-transform duration-[420ms] group-hover:scale-[1.035]"
              src="/figma/home-08.jpg"
              alt="Kakashi collectible posed with blue lightning"
              fill
              sizes="(max-width: 800px) 100vw, 28vw"
            />
            <figcaption className="absolute bottom-[18px] left-[18px] flex items-center justify-between gap-5 bg-white px-3 py-2.5 text-[0.7rem] font-black tracking-[0.1em] uppercase">
              <span>Collector stories</span>
              <span className="text-brand-red">02</span>
            </figcaption>
          </figure>
          <figure className="group relative overflow-hidden bg-brand-ink max-[820px]:row-start-2 max-[560px]:mt-3 max-[560px]:h-[300px]">
            <Image
              className="object-cover transition-transform duration-[420ms] group-hover:scale-[1.035]"
              src="/figma/blog-06.jpg"
              alt="A colourful wall of anime scenes"
              fill
              sizes="(max-width: 800px) 100vw, 28vw"
            />
            <figcaption className="absolute bottom-[18px] left-[18px] flex items-center justify-between gap-5 bg-white px-3 py-2.5 text-[0.7rem] font-black tracking-[0.1em] uppercase">
              <span>Watch list</span>
              <span className="text-brand-red">03</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={`${shell} ${sectionPadding}`}>
        <SectionHeading
          kicker="02 / Link up in real life"
          title="Community"
          accent="events."
          copy="Hangouts, conventions, watch parties and the sessions that turn usernames into real friendships."
          href="/events"
          linkLabel="All events"
        />
        <div className="mt-[70px] grid grid-cols-[1.4fr_0.8fr] gap-[22px] max-[1100px]:grid-cols-1">
          <EventCard event={events[2]} featured />
          <div className="grid gap-[30px] max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">
            <EventCard event={events[0]} variant="stack" />
            <EventCard event={events[1]} variant="stack" />
          </div>
        </div>
      </section>

      <section
        className={`bg-brand-ink py-[clamp(90px,11vw,160px)] text-white`}
      >
        <div className={shell}>
          <SectionHeading
            light
            kicker="03 / Find your lane"
            title="There is a crew"
            accent="for that."
            copy="Different obsessions, one community. Pick a lane or move between all four."
          />
          <div className="mt-[70px] grid grid-cols-4 border-l border-white/18 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">
            {communityLanes.map((lane) => (
              <Link
                className={`group relative flex min-h-[430px] flex-col border-b border-r border-t border-white/18 p-[26px] transition-[background,color] duration-[220ms] max-[1100px]:min-h-[340px] ${lane.accent === "blue" ? "hover:bg-brand-blue hover:text-brand-ink" : lane.accent === "red" ? "hover:bg-brand-red" : lane.accent === "orange" ? "hover:bg-brand-orange hover:text-brand-ink" : "hover:bg-white hover:text-brand-ink"}`}
                href="/community"
                key={lane.number}
              >
                <span className="font-display text-[2rem]">{lane.number}</span>
                <h3 className="mt-auto font-display text-[clamp(2rem,3.6vw,4rem)] leading-[0.9] uppercase">
                  {lane.title}
                </h3>
                <p className="mt-5 text-[0.82rem]">{lane.copy}</p>
                <b className="mt-7 flex items-center justify-between border-t border-current pt-3.5 text-[0.7rem] tracking-[0.1em] uppercase">
                  Explore <i className="text-base not-italic">↗</i>
                </b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${shell} ${sectionPadding}`}>
        <SectionHeading
          kicker="04 / Community archive"
          title="This is"
          accent="PH Otakus."
          href="/gallery"
          linkLabel="Open gallery"
        />
        <div className="mt-[70px] grid grid-cols-12 grid-rows-[340px_260px] gap-3 max-[820px]:grid-cols-2 max-[820px]:grid-rows-[repeat(3,280px)] max-[560px]:block">
          {gallery.slice(0, 5).map((item, index) => (
            <figure
              className={`group relative overflow-hidden bg-brand-ink max-[560px]:h-[280px] ${homeGalleryDesktop[index]} ${homeGalleryTablet[index]} ${index > 0 ? "max-[560px]:mt-2.5" : ""}`}
              key={item.label}
            >
              <Image
                className="object-cover transition-transform duration-[420ms] group-hover:scale-[1.035]"
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 760px) 100vw, 40vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end gap-3.5 bg-[linear-gradient(transparent,rgba(35,31,32,0.82))] px-[18px] pb-4 pt-[42px] text-white">
                <span className="font-display text-[1.6rem] text-brand-orange">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <b className="pb-1 text-[0.72rem] tracking-[0.1em] uppercase">
                  {item.label}
                </b>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={`${shell} ${sectionPadding}`}>
        <SectionHeading
          kicker="05 / From the group chat"
          title="Stories worth"
          accent="sharing."
          href="/blog"
          linkLabel="All stories"
        />
        <div className="mt-[70px] grid grid-cols-3 gap-[22px] max-[820px]:grid-cols-1">
          {stories.map((story, index) => (
            <StoryCard story={story} index={index} key={story.slug} />
          ))}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
