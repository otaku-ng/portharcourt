import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminEventForm, type AdminEventFormData } from "@/components/admin-event-form";
import { setEventPublishedAction, updateEventAction } from "@/lib/events/actions";
import { formatDateTimeInput } from "@/lib/events/validation";
import { getAdminEventById } from "@/lib/events/repository";

export default async function EditAdminEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getAdminEventById(id);
  if (!event) notFound();

  const initial: AdminEventFormData = {
    id: event.id,
    title: event.title,
    slug: event.slug,
    eyebrow: event.eyebrow,
    description: event.description,
    startAt: formatDateTimeInput(event.startAt),
    endAt: formatDateTimeInput(event.endAt),
    dateLabel: event.dateLabel ?? "",
    timeLabel: event.timeLabel ?? "",
    location: event.location,
    venue: event.venue ?? "",
    coverImageUrl: event.coverImageUrl,
    coverImageKey: event.coverImageKey ?? "",
    coverImageAlt: event.coverImageAlt,
    status: event.status,
    published: event.published,
  };

  return (
    <section>
      <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase hover:text-brand-red" href="/admin/events">← Back to events</Link>
      <div className="mt-12 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">Edit event</p>
          <h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">{event.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[0.7rem] font-black tracking-[0.08em] uppercase">
          {event.published ? <Link className="border-b-2 border-current pb-1 hover:text-brand-red" href={`/events/${event.slug}`} target="_blank">View public ↗</Link> : null}
          <form action={setEventPublishedAction}>
            <input name="id" type="hidden" value={event.id} />
            <input name="published" type="hidden" value={event.published ? "false" : "true"} />
            <input name="returnTo" type="hidden" value={`/admin/events/${event.id}`} />
            <button className="border-b-2 border-current pb-1 hover:text-brand-red" type="submit">{event.published ? "Unpublish" : "Publish"}</button>
          </form>
        </div>
      </div>
      <p className="mt-5 max-w-[620px] text-brand-ink-soft">Keep the current cover or replace it with a new direct-to-R2 upload. Replacing an image does not delete the previous object.</p>
      <div className="mt-12 max-w-[980px]"><AdminEventForm action={updateEventAction} initial={initial} /></div>
    </section>
  );
}
