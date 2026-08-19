import Link from "next/link";
import { AdminEventForm, type AdminEventFormData } from "@/components/admin-event-form";
import { createEventAction } from "@/lib/events/actions";

const initialEvent: AdminEventFormData = {
  title: "",
  slug: "",
  eyebrow: "Community event",
  description: "",
  startAt: "",
  endAt: "",
  dateLabel: "",
  timeLabel: "",
  location: "Port Harcourt",
  venue: "",
  coverImageUrl: "",
  coverImageKey: "",
  coverImageAlt: "",
  status: "UPCOMING",
  published: false,
};

export default function NewAdminEventPage() {
  return (
    <section>
      <Link className="text-[0.7rem] font-black tracking-[0.1em] uppercase hover:text-brand-red" href="/admin/events">← Back to events</Link>
      <p className="mt-12 text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">New event</p>
      <h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">Create an event.</h1>
      <p className="mt-5 max-w-[620px] text-brand-ink-soft">Save a draft while the details are taking shape, or publish it when it is ready for the community.</p>
      <div className="mt-12 max-w-[980px]"><AdminEventForm action={createEventAction} initial={initialEvent} /></div>
    </section>
  );
}
