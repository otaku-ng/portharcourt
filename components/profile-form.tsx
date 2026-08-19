"use client";

import { useActionState } from "react";
import type { ProfileActionState } from "@/lib/profiles/actions";
import { saveProfileAction } from "@/lib/profiles/actions";
import { CREATOR_TYPE_OPTIONS, INTEREST_OPTIONS } from "@/lib/profiles/validation";
import type { ProfileFormValues } from "@/lib/profiles/validation";

const initialState: ProfileActionState = {};

export function ProfileForm({ initial, mode }: { initial: ProfileFormValues; mode: "setup" | "edit" }) {
  const [state, formAction, pending] = useActionState(saveProfileAction, initialState);
  const errorFor = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="grid gap-8">
      <div className="grid gap-6 border-t border-[var(--line)] pt-6 md:grid-cols-2">
        <Field label="Username" name="username" defaultValue={initial.username} error={errorFor("username")} hint="3–30 lowercase letters, numbers, _ or -." required />
        <Field label="Display name" name="displayName" defaultValue={initial.displayName} error={errorFor("displayName")} required />
        <Field label="City" name="city" defaultValue={initial.city ?? ""} error={errorFor("city")} />
        <label className="grid gap-2 text-[0.7rem] font-black tracking-[0.12em] uppercase">
          Creator type
          <select className="min-h-12 border border-[var(--line)] bg-white px-4 text-base font-normal tracking-normal normal-case outline-none focus:border-brand-blue" defaultValue={initial.creatorType ?? ""} name="creatorType">
            <option value="">Choose one (optional)</option>
            {CREATOR_TYPE_OPTIONS.map((creatorType) => <option key={creatorType} value={creatorType}>{creatorType}</option>)}
          </select>
          {errorFor("creatorType") ? <span className="text-xs font-normal tracking-normal text-brand-red normal-case">{errorFor("creatorType")}</span> : null}
        </label>
      </div>

      <label className="grid gap-2 text-[0.7rem] font-black tracking-[0.12em] uppercase">
        Bio
        <textarea aria-describedby={errorFor("bio") ? "bio-error" : undefined} className="min-h-32 border border-[var(--line)] bg-white px-4 py-3 text-base font-normal tracking-normal normal-case outline-none focus:border-brand-blue" defaultValue={initial.bio ?? ""} name="bio" placeholder="What are you into?" />
        {errorFor("bio") ? <span className="text-xs font-normal tracking-normal text-brand-red normal-case" id="bio-error">{errorFor("bio")}</span> : null}
      </label>

      <fieldset className="border-t border-[var(--line)] pt-6">
        <legend className="text-[0.7rem] font-black tracking-[0.12em] uppercase">Interests</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {INTEREST_OPTIONS.map((interest) => (
            <label className="flex cursor-pointer items-center gap-3 border border-[var(--line)] bg-white px-4 py-3 text-sm transition-colors has-[:checked]:border-brand-red has-[:checked]:bg-brand-blue" key={interest}>
              <input className="size-4 accent-brand-red" defaultChecked={initial.interests.includes(interest)} name="interests" type="checkbox" value={interest} />
              <span>{interest}</span>
            </label>
          ))}
        </div>
        {errorFor("interests") ? <p className="mt-3 text-xs text-brand-red" role="alert">{errorFor("interests")}</p> : null}
      </fieldset>

      <div className="grid gap-6 border-t border-[var(--line)] pt-6 md:grid-cols-3">
        <Field label="Favourite anime" name="favouriteAnime" defaultValue={initial.favouriteAnime ?? ""} error={errorFor("favouriteAnime")} />
        <Field label="Favourite manga" name="favouriteManga" defaultValue={initial.favouriteManga ?? ""} error={errorFor("favouriteManga")} />
        <Field label="Favourite games" name="favouriteGames" defaultValue={initial.favouriteGames ?? ""} error={errorFor("favouriteGames")} />
      </div>

      {state.error ? <p className="text-sm text-brand-red" role="alert">{state.error}</p> : null}
      <div className="flex flex-wrap items-center gap-4">
        <button className="inline-flex min-h-12 items-center justify-center bg-brand-red px-6 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase transition-colors hover:bg-brand-coral disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">{pending ? "Saving…" : mode === "setup" ? "Create profile" : "Save changes"}</button>
        {mode === "edit" ? <span className="text-sm text-brand-ink-soft">Your Google avatar stays connected by default.</span> : <span className="text-sm text-brand-ink-soft">You can add the optional details later.</span>}
      </div>
    </form>
  );
}

function Field({ label, name, defaultValue, error, hint, required = false, type = "text" }: { label: string; name: string; defaultValue: string; error?: string; hint?: string; required?: boolean; type?: string }) {
  const errorId = `${name}-error`;
  return (
    <label className="grid gap-2 text-[0.7rem] font-black tracking-[0.12em] uppercase">
      {label}
      <input aria-describedby={error ? errorId : undefined} className="min-h-12 border border-[var(--line)] bg-white px-4 text-base font-normal tracking-normal normal-case outline-none focus:border-brand-blue" defaultValue={defaultValue} name={name} required={required} type={type} />
      {hint ? <span className="text-xs font-normal tracking-normal text-brand-ink-soft normal-case">{hint}</span> : null}
      {error ? <span className="text-xs font-normal tracking-normal text-brand-red normal-case" id={errorId}>{error}</span> : null}
    </label>
  );
}
