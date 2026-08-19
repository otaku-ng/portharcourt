import { getAdminNewsletterSubscribers, getSubscribedNewsletterCount } from "@/lib/newsletter/repository";

export default async function AdminNewsletterPage() {
  const [subscribers, subscribedCount] = await Promise.all([
    getAdminNewsletterSubscribers(),
    getSubscribedNewsletterCount(),
  ]);

  return (
    <section>
      <div>
        <p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">Newsletter desk</p>
        <h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">Stay connected.</h1>
        <p className="mt-5 max-w-[520px] text-brand-ink-soft">Subscriber records are persisted here for future newsletter delivery. Sending and marketing automation are intentionally outside this phase.</p>
      </div>
      <div className="mt-12 grid max-w-[420px] grid-cols-2 border-y border-[var(--line)]">
        <div className="border-r border-[var(--line)] px-5 py-5"><strong className="font-display text-4xl text-brand-blue">{subscribedCount}</strong><p className="mt-2 text-[0.65rem] font-black tracking-[0.1em] uppercase">Subscribed</p></div>
        <div className="px-5 py-5"><strong className="font-display text-4xl">{subscribers.length}</strong><p className="mt-2 text-[0.65rem] font-black tracking-[0.1em] uppercase">All records</p></div>
      </div>
      <div className="mt-12 overflow-hidden border-y border-[var(--line)]">
        {subscribers.length === 0 ? <div className="py-12 text-brand-ink-soft">No subscribers yet.</div> : (
          <div className="divide-y divide-[var(--line)]">
            {subscribers.map((subscriber) => (
              <div className="grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_0.6fr_0.8fr] sm:items-center" key={subscriber.id}>
                <p className="font-medium">{subscriber.email}</p>
                <p className={`text-[0.68rem] font-black tracking-[0.1em] uppercase ${subscriber.status === "SUBSCRIBED" ? "text-brand-blue" : "text-brand-ink-soft"}`}>{subscriber.status === "SUBSCRIBED" ? "Subscribed" : "Unsubscribed"}</p>
                <p className="text-sm text-brand-ink-soft">{subscriber.subscribedAt.toLocaleDateString("en-GB")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
