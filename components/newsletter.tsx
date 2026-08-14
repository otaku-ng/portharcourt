import Link from "next/link";

export function Newsletter() {
  return (
    <section className="newsletter section-shell" aria-labelledby="newsletter-title">
      <div>
        <p className="kicker">Stay in the loop</p>
        <h2 id="newsletter-title">Don&apos;t miss the <em>next link-up.</em></h2>
      </div>
      <p>Event announcements, community stories and the occasional hot take—sent when there is something worth sharing.</p>
      <Link className="button button-dark" href="/contact">Get updates <span>↗</span></Link>
    </section>
  );
}
