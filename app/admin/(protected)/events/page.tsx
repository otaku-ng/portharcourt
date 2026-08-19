import Link from "next/link";
import { setEventPublishedAction } from "@/lib/events/actions";
import { formatEventDate } from "@/lib/event-data";
import { getAdminEvents } from "@/lib/events/repository";

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, events] = await Promise.all([searchParams, getAdminEvents()]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">Event desk</p>
          <h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">Manage events.</h1>
          <p className="mt-5 max-w-[520px] text-brand-ink-soft">Draft, edit and publish the community events that flow into the existing public site.</p>
        </div>
        <Link className="inline-flex min-h-12 items-center justify-center bg-brand-red px-5 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase hover:bg-brand-coral" href="/admin/events/new">Create event <span className="ml-6">↗</span></Link>
      </div>

      {error === "publication" ? <p className="mt-6 text-sm text-brand-red" role="alert">The publication state could not be updated.</p> : null}

      <div className="mt-12 overflow-hidden border-y border-[var(--line)]">
        {events.length === 0 ? (
          <div className="py-12 text-brand-ink-soft">No events yet. Create the first one to get started.</div>
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {events.map((event) => (
              <article className="grid gap-5 py-6 md:grid-cols-[minmax(0,1.6fr)_0.8fr_0.7fr_auto] md:items-center" key={event.id}>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-[0.68rem] font-black tracking-[0.14em] text-brand-red uppercase">{event.status === "UPCOMING" ? "Upcoming" : "Archived"}</p>
                    <span className={`text-[0.68rem] font-black tracking-[0.12em] uppercase ${event.published ? "text-brand-blue" : "text-brand-ink-soft"}`}>{event.published ? "Published" : "Draft"}</span>
                  </div>
                  <h2 className="mt-2 font-display text-[clamp(1.8rem,3vw,3rem)] font-bold leading-[0.9] uppercase"><Link className="hover:text-brand-red" href={`/admin/events/${event.id}`}>{event.title}</Link></h2>
                  <p className="mt-2 text-sm text-brand-ink-soft">/{event.slug}</p>
                </div>
                <div className="text-sm">
                  <p className="text-[0.65rem] font-black tracking-[0.12em] uppercase">Event date</p>
                  <p className="mt-1">{formatEventDate(event.startAt, event.dateLabel)}</p>
                  <p className="mt-1 text-brand-ink-soft">{event.timeLabel || "Time TBA"}</p>
                </div>
                <div className="text-sm">
                  <p className="text-[0.65rem] font-black tracking-[0.12em] uppercase">Updated</p>
                  <p className="mt-1">{event.updatedAt.toLocaleDateString("en-GB")}</p>
                  <p className="mt-1 text-brand-ink-soft">{event.location}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[0.7rem] font-black tracking-[0.08em] uppercase">
                  <Link className="border-b-2 border-current pb-1 hover:text-brand-red" href={`/admin/events/${event.id}`}>Edit</Link>
                  {event.published ? <Link className="border-b-2 border-current pb-1 hover:text-brand-red" href={`/events/${event.slug}`} target="_blank">View public ↗</Link> : null}
                  <form action={setEventPublishedAction}>
                    <input name="id" type="hidden" value={event.id} />
                    <input name="published" type="hidden" value={event.published ? "false" : "true"} />
                    <input name="returnTo" type="hidden" value="/admin/events" />
                    <button className="border-b-2 border-current pb-1 hover:text-brand-red" type="submit">{event.published ? "Unpublish" : "Publish"}</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
