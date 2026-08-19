"use client";

import { useActionState } from "react";
import type { UserRole } from "@prisma/client";
import type { RoleActionState } from "@/lib/admin/actions";
import { updateUserRoleAction } from "@/lib/admin/actions";

const initialState: RoleActionState = {};

export function AdminRoleForm({ userId, role, nextRole, label }: { userId: string; role: UserRole; nextRole: UserRole; label: string }) {
  const [state, formAction, pending] = useActionState(updateUserRoleAction, initialState);

  return (
    <form action={formAction} className="grid justify-items-end gap-2">
      <input name="userId" type="hidden" value={userId} />
      <input name="role" type="hidden" value={nextRole} />
      <button className="border-b-2 border-current pb-1 text-[0.68rem] font-black tracking-[0.08em] uppercase hover:text-brand-red disabled:cursor-wait disabled:opacity-50" disabled={pending} type="submit">
        {pending ? "Saving…" : label}
      </button>
      {state.error ? <p className="max-w-[240px] text-right text-xs text-brand-red" role="alert">{state.error}</p> : null}
      <span className="sr-only">Current role: {role}</span>
    </form>
  );
}
