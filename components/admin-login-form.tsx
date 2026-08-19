"use client";

import { useActionState } from "react";
import type { AdminLoginState } from "@/lib/auth/actions";
import { loginAction } from "@/lib/auth/actions";

const initialState: AdminLoginState = {};

export function AdminLoginForm({ nextPath }: { nextPath?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid max-w-[430px] gap-5">
      <input type="hidden" name="next" value={nextPath ?? "/admin/events"} />
      <label className="grid gap-2 text-[0.7rem] font-black tracking-[0.12em] uppercase">
        Admin password
        <input
          autoComplete="current-password"
          className="min-h-12 border border-[var(--line)] bg-white px-4 text-base font-normal tracking-normal normal-case outline-none transition-colors focus:border-brand-blue"
          name="password"
          type="password"
          required
        />
      </label>
      {state.error ? <p className="text-sm text-brand-red" role="alert">{state.error}</p> : null}
      <button
        className="inline-flex min-h-12 items-center justify-center bg-brand-red px-5 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase transition-colors hover:bg-brand-coral disabled:cursor-wait disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Checking…" : "Enter admin"}
      </button>
    </form>
  );
}
