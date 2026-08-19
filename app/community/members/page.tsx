import type { Metadata } from "next";
import Link from "next/link";
import { MemberCard } from "@/components/member-card";
import { getPublicMembers } from "@/lib/members/repository";
import {
  memberDirectoryHref,
  parseMemberDirectoryParams,
} from "@/lib/members/directory";
import {
  CREATOR_TYPE_OPTIONS,
  INTEREST_OPTIONS,
} from "@/lib/profiles/validation";
import { button, displayHeading, kicker, sectionPadding, shell } from "@/lib/tailwind";

export const metadata: Metadata = {
  title: "Members",
  description: "Discover the public member directory for the PH Otakus community in Port Harcourt.",
};

export const dynamic = "force-dynamic";

type MemberDirectoryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MemberDirectoryPage({ searchParams }: MemberDirectoryPageProps) {
  const filters = parseMemberDirectoryParams(await searchParams);
  const directory = await getPublicMembers(filters);
  const hasFilters = Boolean(filters.q || filters.interest || filters.creator);
  const resultLabel = directory.totalCount === 1 ? "member" : "members";

  return (
    <main className="overflow-hidden">
      <section className="bg-brand-ink text-white">
        <div className={`${shell} grid grid-cols-[1fr_minmax(240px,0.42fr)] gap-[8vw] py-[clamp(80px,12vw,170px)] max-[820px]:grid-cols-1 max-[820px]:gap-8`}>
          <div>
            <p className={`${kicker} text-white`}><span className="text-brand-red">02.1</span> Community directory</p>
            <h1 className={`${displayHeading} mt-7 text-[clamp(4.5rem,10vw,10rem)]`}>Meet the <em className="font-inherit not-italic text-brand-blue">people.</em></h1>
          </div>
          <p className="max-w-[390px] self-end text-base text-white/80">Find the fans, makers and creators who make PH Otakus feel close to home. Browse public profiles by name, interest or creative lane.</p>
        </div>
      </section>

      <section className={`${shell} ${sectionPadding}`} aria-labelledby="directory-heading">
        <div className="border-t border-[var(--line)] pt-6">
          <div className="grid grid-cols-[1fr_minmax(260px,0.58fr)] items-end gap-8 max-[820px]:grid-cols-1">
            <div>
              <p className={`${kicker} mb-5`}><span className="text-brand-red">Public profiles</span> Find your people</p>
              <h2 className={`${displayHeading} text-[clamp(3.2rem,6vw,6.5rem)]`} id="directory-heading">Search the <em className="font-inherit not-italic text-brand-red">directory.</em></h2>
            </div>
            <p className="max-w-[420px]">Everyone shown here has completed their member profile. Open a card to learn more about what they are into.</p>
          </div>

          <div className="mt-12 border-y border-[var(--line)] py-7">
            <form className="flex items-end gap-3 max-[620px]:flex-col max-[620px]:items-stretch" action="/community/members" method="get" role="search">
              <div className="min-w-0 flex-1">
                <label className={kicker} htmlFor="member-search">Search members</label>
                <input
                  className="mt-3 block min-h-14 w-full border-b-2 border-brand-ink bg-transparent px-0 text-lg outline-none placeholder:text-brand-ink-soft/60 focus:border-brand-red"
                  defaultValue={filters.q}
                  id="member-search"
                  name="q"
                  placeholder="Search by name or username"
                  type="search"
                  maxLength={80}
                />
              </div>
              {filters.interest ? <input name="interest" type="hidden" value={filters.interest} /> : null}
              {filters.creator ? <input name="creator" type="hidden" value={filters.creator} /> : null}
              <button className={`${button} min-h-14 bg-brand-ink text-white hover:bg-brand-red`} type="submit">Search <span>↗</span></button>
            </form>

            <div className="mt-9 grid grid-cols-[1fr_240px] gap-8 max-[820px]:grid-cols-1">
              <div>
                <p className={kicker}>Filter by interest</p>
                <nav className="mt-4" aria-label="Filter members by interest">
                  <ul className="flex flex-wrap gap-2">
                    <li>
                      <Link
                        className={`inline-flex min-h-10 items-center border px-3 text-[0.7rem] font-black tracking-[0.08em] uppercase transition-colors hover:border-brand-ink hover:bg-brand-ink hover:text-white ${!filters.interest ? "border-brand-ink bg-brand-ink text-white" : "border-[var(--line)]"}`}
                        href={memberDirectoryHref({ ...filters, interest: undefined, page: 1 })}
                        aria-current={!filters.interest ? "page" : undefined}
                      >
                        All
                      </Link>
                    </li>
                    {INTEREST_OPTIONS.map((interest) => {
                      const active = filters.interest === interest;
                      return (
                        <li key={interest}>
                          <Link
                            className={`inline-flex min-h-10 items-center border px-3 text-[0.7rem] font-black tracking-[0.08em] uppercase transition-colors hover:border-brand-ink hover:bg-brand-ink hover:text-white ${active ? "border-brand-ink bg-brand-ink text-white" : "border-[var(--line)]"}`}
                            href={memberDirectoryHref({ ...filters, interest: active ? undefined : interest, page: 1 })}
                            aria-current={active ? "page" : undefined}
                          >
                            {interest}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              <form className="self-start" action="/community/members" method="get">
                <label className={kicker} htmlFor="creator-filter">Filter by creator type</label>
                {filters.q ? <input name="q" type="hidden" value={filters.q} /> : null}
                {filters.interest ? <input name="interest" type="hidden" value={filters.interest} /> : null}
                <select className="mt-3 min-h-12 w-full border border-brand-ink bg-brand-paper px-3 text-sm font-black tracking-[0.04em] uppercase" defaultValue={filters.creator ?? ""} id="creator-filter" name="creator">
                  <option value="">All members</option>
                  <option value="all">Creators</option>
                  {CREATOR_TYPE_OPTIONS.map((creatorType) => <option key={creatorType} value={creatorType}>{creatorType}</option>)}
                </select>
                <button className="mt-3 border-b-2 border-current pb-1 text-[0.7rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" type="submit">Apply creator filter <span aria-hidden="true">↗</span></button>
              </form>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className={kicker}><span className="text-brand-red">{directory.totalCount}</span> {resultLabel} found</p>
              {hasFilters ? <p className="mt-2 text-sm text-brand-ink-soft">Showing matches{filters.q ? ` for “${filters.q}”` : ""}{filters.interest ? ` into ${filters.interest}` : ""}{filters.creator ? ` · ${filters.creator === "all" ? "Creators" : filters.creator}` : ""}.</p> : null}
            </div>
            {hasFilters ? <Link className="border-b-2 border-current pb-1 text-[0.7rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" href="/community/members">Clear filters <span aria-hidden="true">↗</span></Link> : null}
          </div>

          {directory.members.length > 0 ? (
            <div className="mt-8 grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
              {directory.members.map((member) => <MemberCard key={member.username} member={member} />)}
            </div>
          ) : (
            <div className="mt-8 border-y border-[var(--line)] py-[clamp(70px,10vw,130px)] text-center">
              <p className={kicker}><span className="text-brand-red">No matches</span> Try another route</p>
              <h2 className={`${displayHeading} mx-auto mt-6 max-w-[780px] text-[clamp(3.2rem,7vw,7rem)]`}>{hasFilters ? "No one here yet." : "The directory is just getting started."}</h2>
              <p className="mx-auto mt-6 max-w-[460px]">{hasFilters ? "Try a different name or filter, or clear the current selection to browse everyone." : "Completed member profiles will appear here as the community grows."}</p>
              <Link className={`${button} mt-8 border-brand-ink hover:bg-brand-ink hover:text-white`} href={hasFilters ? "/community/members" : "/community"}>{hasFilters ? "Clear filters" : "Back to community"} <span>↗</span></Link>
            </div>
          )}

          {directory.totalPages > 1 ? <Pagination currentPage={directory.page} totalPages={directory.totalPages} filters={filters} /> : null}
        </div>
      </section>
    </main>
  );
}

function Pagination({
  currentPage,
  totalPages,
  filters,
}: {
  currentPage: number;
  totalPages: number;
  filters: ReturnType<typeof parseMemberDirectoryParams>;
}) {
  const pages = getPaginationPages(currentPage, totalPages);

  return (
    <nav className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--line)] pt-5" aria-label="Member directory pagination">
      <p className={kicker}>Page {currentPage} of {totalPages}</p>
      <div className="flex items-center gap-2">
        {currentPage > 1 ? <Link className="border border-[var(--line)] px-3 py-2 text-sm font-black hover:border-brand-ink hover:bg-brand-ink hover:text-white" href={memberDirectoryHref({ ...filters, page: currentPage - 1 })} aria-label="Previous page">←</Link> : <span className="border border-[var(--line)] px-3 py-2 text-sm opacity-35" aria-disabled="true">←</span>}
        {pages.map((page, index) => page === "ellipsis" ? <span className="px-1 text-sm" key={`ellipsis-${index}`} aria-hidden="true">…</span> : <Link className={`border px-3 py-2 text-sm font-black ${page === currentPage ? "border-brand-ink bg-brand-ink text-white" : "border-[var(--line)] hover:border-brand-ink hover:bg-brand-ink hover:text-white"}`} href={memberDirectoryHref({ ...filters, page })} aria-current={page === currentPage ? "page" : undefined} key={page}>{page}</Link>)}
        {currentPage < totalPages ? <Link className="border border-[var(--line)] px-3 py-2 text-sm font-black hover:border-brand-ink hover:bg-brand-ink hover:text-white" href={memberDirectoryHref({ ...filters, page: currentPage + 1 })} aria-label="Next page">→</Link> : <span className="border border-[var(--line)] px-3 py-2 text-sm opacity-35" aria-disabled="true">→</span>}
      </div>
    </nav>
  );
}

function getPaginationPages(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  if (currentPage >= totalPages - 3) return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

