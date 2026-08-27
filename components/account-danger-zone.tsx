"use client";

import { useActionState, useState } from "react";
import type { DeleteAccountActionState } from "@/lib/auth/member-actions";
import { deleteAccountAction } from "@/lib/auth/member-actions";

const initialState: DeleteAccountActionState = {};

export function AccountDangerZone() {
  const [state, formAction, pending] = useActionState(deleteAccountAction, initialState);
  const [armed, setArmed] = useState(false);

  return (
    <section className="border-t-4 border-brand-red pt-6" aria-labelledby="delete-account-heading">
      <p className="text-[0.7rem] font-black tracking-[0.12em] text-brand-red uppercase">Account management</p>
      <h2 className="mt-3 font-display text-[clamp(2.4rem,5vw,4.6rem)] uppercase" id="delete-account-heading">Delete your account</h2>
      <p className="mt-4 max-w-[650px] text-sm leading-[1.6] text-brand-ink-soft">This permanently removes your profile, event RSVPs and activity, badges, login account and sessions. Your profile images and banners will also be removed from storage.</p>

      {!armed ? (
        <button className="mt-7 border border-brand-red px-5 py-3 text-[0.72rem] font-black tracking-[0.08em] text-brand-red uppercase hover:bg-brand-red hover:text-white" onClick={() => setArmed(true)} type="button">
          Start account deletion
        </button>
      ) : (
        <form action={formAction} className="mt-7 max-w-[540px] border border-brand-red bg-white p-5">
          <p className="font-black">This cannot be undone.</p>
          <label className="mt-4 grid gap-2 text-[0.7rem] font-black tracking-[0.1em] uppercase" htmlFor="delete-account-confirmation">
            Type DELETE to confirm
            <input
              autoComplete="off"
              className="min-h-12 border border-[var(--line)] px-4 text-base font-normal tracking-normal normal-case outline-none focus:border-brand-red"
              id="delete-account-confirmation"
              name="confirmation"
              required
              spellCheck="false"
              type="text"
            />
          </label>
          {state.error ? <p className="mt-4 text-sm text-brand-red" role="alert">{state.error}</p> : null}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button className="bg-brand-red px-5 py-3 text-[0.72rem] font-black tracking-[0.08em] text-white uppercase hover:bg-brand-coral disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">
              {pending ? "Deleting…" : "Delete account permanently"}
            </button>
            <button className="border-b-2 border-current pb-1 text-[0.7rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" disabled={pending} onClick={() => setArmed(false)} type="button">
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
