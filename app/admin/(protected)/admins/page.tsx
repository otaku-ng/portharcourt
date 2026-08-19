import type { Metadata } from "next";
import { UserRole } from "@prisma/client";
import { requireSuperAdmin } from "@/lib/auth/admin";
import { getAdminsByRole, searchUsersForAdmin, type AdminUserDto } from "@/lib/admin/repository";
import { AdminRoleForm } from "@/components/admin-role-form";
import { MemberAvatar } from "@/components/member-avatar";

export const metadata: Metadata = {
  title: "Manage admins",
  robots: { index: false, follow: false },
};

export default async function AdminManagementPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const superAdmin = await requireSuperAdmin("/admin/admins");
  if (!superAdmin) {
    return (
      <section>
        <p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">Restricted room</p>
        <h1 className="mt-4 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] uppercase">Super admins only.</h1>
        <p className="mt-6 max-w-[520px] text-brand-ink-soft">Administrator role management is limited to super admins.</p>
      </section>
    );
  }

  const { q = "" } = await searchParams;
  const [superAdmins, admins, searchResults] = await Promise.all([
    getAdminsByRole(UserRole.SUPER_ADMIN),
    getAdminsByRole(UserRole.ADMIN),
    searchUsersForAdmin(q),
  ]);

  return (
    <section>
      <div>
        <p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">People desk</p>
        <h1 className="mt-3 font-display text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.82] tracking-[-0.03em] uppercase">Manage admins.</h1>
        <p className="mt-5 max-w-[620px] text-brand-ink-soft">Find an existing PH Otakus user and give them the right level of access. Role changes take effect on the next protected server request.</p>
      </div>

      <div className="mt-12 border-y border-[var(--line)] py-7">
        <form action="/admin/admins" className="flex items-end gap-3 max-[620px]:flex-col max-[620px]:items-stretch" method="get" role="search">
          <label className="min-w-0 flex-1 text-[0.7rem] font-black tracking-[0.12em] uppercase" htmlFor="admin-user-search">
            Search members
            <input className="mt-3 block min-h-14 w-full border-b-2 border-brand-ink bg-transparent px-0 text-lg font-normal tracking-normal normal-case outline-none placeholder:text-brand-ink-soft/60 focus:border-brand-red" defaultValue={q} id="admin-user-search" maxLength={80} name="q" placeholder="Name, username or email" type="search" />
          </label>
          <button className="inline-flex min-h-14 items-center bg-brand-ink px-5 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase hover:bg-brand-red" type="submit">Search <span className="ml-6">↗</span></button>
        </form>
        <p className="mt-4 text-sm text-brand-ink-soft">This private view may show email addresses so you can identify the right account.</p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <RoleGroup heading="Super admins" users={superAdmins} empty="No super admins found." />
        <RoleGroup heading="Admins" users={admins} empty="No admins found." />
      </div>

      {q.trim() ? <div className="mt-14"><p className="text-[0.72rem] font-black tracking-[0.18em] text-brand-red uppercase">Search results</p><h2 className="mt-3 font-display text-[clamp(2.7rem,5vw,5rem)] font-black leading-[0.86] uppercase">Existing users.</h2><div className="mt-6"><UserList users={searchResults} searchable /></div></div> : null}
    </section>
  );
}

function RoleGroup({ heading, users, empty }: { heading: string; users: AdminUserDto[]; empty: string }) {
  return <div><h2 className="font-display text-[2.5rem] font-black leading-none uppercase">{heading}</h2><div className="mt-5"><UserList users={users} /></div>{users.length === 0 ? <p className="border-t border-[var(--line)] pt-5 text-sm text-brand-ink-soft">{empty}</p> : null}</div>;
}

function UserList({ users, searchable = false }: { users: AdminUserDto[]; searchable?: boolean }) {
  if (users.length === 0) return <p className="border-t border-[var(--line)] pt-5 text-sm text-brand-ink-soft">{searchable ? "No existing users matched that search." : "None yet."}</p>;

  return <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">{users.map((user) => <UserRow key={user.userId} user={user} />)}</div>;
}

function UserRow({ user }: { user: AdminUserDto }) {
  const identity = user.username ? `@${user.username}` : user.email ?? "No email on record";
  return (
    <article className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <MemberAvatar name={user.displayName} image={user.avatar} size="small" />
        <div className="min-w-0">
          <p className="truncate font-black">{user.displayName}</p>
          <p className="mt-1 truncate text-sm text-brand-ink-soft">{identity}{user.email && user.username ? ` · ${user.email}` : ""}</p>
          <p className="mt-1 text-[0.66rem] font-black tracking-[0.1em] text-brand-red uppercase">{user.role.replace("_", " ")}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-end gap-4 text-right">
        {user.role === UserRole.MEMBER ? <AdminRoleForm label="Make admin" nextRole={UserRole.ADMIN} role={user.role} userId={user.userId} /> : null}
        {user.role === UserRole.ADMIN ? <><AdminRoleForm label="Make super admin" nextRole={UserRole.SUPER_ADMIN} role={user.role} userId={user.userId} /><AdminRoleForm label="Remove admin" nextRole={UserRole.MEMBER} role={user.role} userId={user.userId} /></> : null}
        {user.role === UserRole.SUPER_ADMIN ? <AdminRoleForm label="Make admin" nextRole={UserRole.ADMIN} role={user.role} userId={user.userId} /> : null}
      </div>
    </article>
  );
}
