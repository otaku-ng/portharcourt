"use client";

import { useActionState, useState, type ChangeEvent, type FormEvent } from "react";
import type { ProfileActionState } from "@/lib/profiles/actions";
import { saveProfileAction } from "@/lib/profiles/actions";
import { CREATOR_TYPE_OPTIONS, INTEREST_OPTIONS } from "@/lib/profiles/validation";
import type { ProfileFormValues } from "@/lib/profiles/validation";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxAvatarSize = 5 * 1024 * 1024;
const maxBannerSize = 10 * 1024 * 1024;
const initialState: ProfileActionState = {};

type MediaKind = "avatar" | "banner";

function uploadFile(uploadUrl: string, file: File, onProgress: (value: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", uploadUrl);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => request.status >= 200 && request.status < 300 ? resolve() : reject(new Error("The image upload was rejected."));
    request.onerror = () => reject(new Error("The image could not be uploaded."));
    request.send(file);
  });
}

export function ProfileForm({ initial, mode, fallbackAvatar = null }: { initial: ProfileFormValues; mode: "setup" | "edit"; fallbackAvatar?: string | null }) {
  const [state, formAction, pending] = useActionState(saveProfileAction, initialState);
  const [avatarKey, setAvatarKey] = useState(initial.avatarKey ?? "");
  const [avatarPreview, setAvatarPreview] = useState(initial.avatarUrl ?? fallbackAvatar);
  const [avatarRemove, setAvatarRemove] = useState(false);
  const [bannerKey, setBannerKey] = useState(initial.bannerKey ?? "");
  const [bannerPreview, setBannerPreview] = useState(initial.bannerUrl);
  const [bannerRemove, setBannerRemove] = useState(false);
  const [uploading, setUploading] = useState<MediaKind | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(kind: MediaKind, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);
    if (!allowedTypes.has(file.type)) {
      setUploadError("Use a JPEG, PNG, WebP or AVIF image.");
      return;
    }

    const maxSize = kind === "avatar" ? maxAvatarSize : maxBannerSize;
    if (file.size <= 0 || file.size > maxSize) {
      setUploadError(`${kind === "avatar" ? "Avatar" : "Banner"} images must be no more than ${kind === "avatar" ? "5" : "10"} MB.`);
      return;
    }

    const previousPreview = kind === "avatar" ? avatarPreview : bannerPreview;
    const localPreview = URL.createObjectURL(file);
    setUploading(kind);
    setUploadProgress(0);
    if (kind === "avatar") setAvatarPreview(localPreview);
    else setBannerPreview(localPreview);

    try {
      const response = await fetch("/api/profile/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, contentType: file.type, size: file.size }),
      });
      const result = (await response.json()) as { uploadUrl?: string; objectKey?: string; publicUrl?: string; error?: string };
      if (!response.ok || !result.uploadUrl || !result.objectKey || !result.publicUrl) throw new Error(result.error || "Could not authorize the image upload.");

      await uploadFile(result.uploadUrl, file, setUploadProgress);
      if (kind === "avatar") {
        setAvatarKey(result.objectKey);
        setAvatarPreview(result.publicUrl);
        setAvatarRemove(false);
      } else {
        setBannerKey(result.objectKey);
        setBannerPreview(result.publicUrl);
        setBannerRemove(false);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "The image could not be uploaded.");
      if (kind === "avatar") setAvatarPreview(previousPreview);
      else setBannerPreview(previousPreview);
    } finally {
      URL.revokeObjectURL(localPreview);
      setUploading(null);
    }
  }

  function removeMedia(kind: MediaKind) {
    if (kind === "avatar") {
      setAvatarKey("");
      setAvatarPreview(fallbackAvatar);
      setAvatarRemove(true);
    } else {
      setBannerKey("");
      setBannerPreview(null);
      setBannerRemove(true);
    }
    setUploadError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (uploading) {
      event.preventDefault();
      setUploadError("Wait for the image upload to finish before saving.");
    }
  }

  const errorFor = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="grid gap-8" onSubmit={handleSubmit}>
      <input name="avatarKey" type="hidden" value={avatarKey} readOnly />
      <input name="avatarRemove" type="hidden" value={avatarRemove ? "true" : "false"} readOnly />
      <input name="bannerKey" type="hidden" value={bannerKey} readOnly />
      <input name="bannerRemove" type="hidden" value={bannerRemove ? "true" : "false"} readOnly />

      <div className="grid gap-6 border-t border-[var(--line)] pt-6 md:grid-cols-2">
        <MediaField kind="avatar" preview={avatarPreview} uploading={uploading} progress={uploadProgress} error={uploadError} onChange={handleFileChange} onRemove={initial.avatarKey || initial.avatarUrl || avatarKey ? () => removeMedia("avatar") : undefined} />
        <MediaField kind="banner" preview={bannerPreview} uploading={uploading} progress={uploadProgress} error={uploadError} onChange={handleFileChange} onRemove={initial.bannerKey || bannerKey ? () => removeMedia("banner") : undefined} />
      </div>
      {errorFor("avatarKey") || errorFor("bannerKey") ? <p className="text-sm text-brand-red" role="alert">{errorFor("avatarKey") ?? errorFor("bannerKey")}</p> : null}

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
          {INTEREST_OPTIONS.map((interest) => <label className="flex cursor-pointer items-center gap-3 border border-[var(--line)] bg-white px-4 py-3 text-sm transition-colors has-[:checked]:border-brand-red has-[:checked]:bg-brand-blue" key={interest}><input className="size-4 accent-brand-red" defaultChecked={initial.interests.includes(interest)} name="interests" type="checkbox" value={interest} /><span>{interest}</span></label>)}
        </div>
        {errorFor("interests") ? <p className="mt-3 text-xs text-brand-red" role="alert">{errorFor("interests")}</p> : null}
      </fieldset>

      <div className="grid gap-6 border-t border-[var(--line)] pt-6 md:grid-cols-3">
        <Field label="Favourite anime" name="favouriteAnime" defaultValue={initial.favouriteAnime ?? ""} error={errorFor("favouriteAnime")} />
        <Field label="Favourite manga" name="favouriteManga" defaultValue={initial.favouriteManga ?? ""} error={errorFor("favouriteManga")} />
        <Field label="Favourite games" name="favouriteGames" defaultValue={initial.favouriteGames ?? ""} error={errorFor("favouriteGames")} />
      </div>

      <div className="grid gap-6 border-t border-[var(--line)] pt-6 md:grid-cols-3">
        <Field label="Currently watching" name="currentlyWatching" defaultValue={initial.currentlyWatching ?? ""} error={errorFor("currentlyWatching")} hint="Up to 120 characters." />
        <Field label="Currently reading" name="currentlyReading" defaultValue={initial.currentlyReading ?? ""} error={errorFor("currentlyReading")} hint="Up to 120 characters." />
        <Field label="Currently playing" name="currentlyPlaying" defaultValue={initial.currentlyPlaying ?? ""} error={errorFor("currentlyPlaying")} hint="Up to 120 characters." />
      </div>

      <fieldset className="border-t border-[var(--line)] pt-6">
        <legend className="text-[0.7rem] font-black tracking-[0.12em] uppercase">Social links</legend>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <Field label="Instagram" name="instagramUrl" defaultValue={initial.instagramUrl ?? ""} error={errorFor("instagramUrl")} type="url" placeholder="https://instagram.com/…" />
          <Field label="TikTok" name="tiktokUrl" defaultValue={initial.tiktokUrl ?? ""} error={errorFor("tiktokUrl")} type="url" placeholder="https://tiktok.com/@…" />
          <Field label="X / Twitter" name="twitterUrl" defaultValue={initial.twitterUrl ?? ""} error={errorFor("twitterUrl")} type="url" placeholder="https://x.com/…" />
          <Field label="YouTube" name="youtubeUrl" defaultValue={initial.youtubeUrl ?? ""} error={errorFor("youtubeUrl")} type="url" placeholder="https://youtube.com/@…" />
          <Field label="Twitch" name="twitchUrl" defaultValue={initial.twitchUrl ?? ""} error={errorFor("twitchUrl")} type="url" placeholder="https://twitch.tv/…" />
          <Field label="Website" name="websiteUrl" defaultValue={initial.websiteUrl ?? ""} error={errorFor("websiteUrl")} type="url" placeholder="https://…" />
        </div>
      </fieldset>

      {state.error ? <p className="text-sm text-brand-red" role="alert">{state.error}</p> : null}
      <div className="flex flex-wrap items-center gap-4">
        <button className="inline-flex min-h-12 items-center justify-center bg-brand-red px-6 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase transition-colors hover:bg-brand-coral disabled:cursor-wait disabled:opacity-60" disabled={pending || Boolean(uploading)} type="submit">{pending ? "Saving…" : mode === "setup" ? "Create profile" : "Save changes"}</button>
        <span className="text-sm text-brand-ink-soft">Your Google avatar remains the fallback when no custom avatar is set.</span>
      </div>
    </form>
  );
}

function MediaField({ kind, preview, uploading, progress, error, onChange, onRemove }: { kind: MediaKind; preview: string | null; uploading: MediaKind | null; progress: number; error: string | null; onChange: (kind: MediaKind, event: ChangeEvent<HTMLInputElement>) => void; onRemove?: () => void }) {
  const label = kind === "avatar" ? "Avatar" : "Profile banner";
  return (
    <div className="grid gap-4">
      <div>
        <p className="text-[0.7rem] font-black tracking-[0.12em] uppercase">{label}</p>
        <p className="mt-2 text-sm text-brand-ink-soft">{kind === "avatar" ? "JPEG, PNG, WebP or AVIF. Maximum 5 MB." : "JPEG, PNG, WebP or AVIF. Maximum 10 MB."}</p>
      </div>
      <div className={`relative overflow-hidden bg-brand-paper-dark ${kind === "avatar" ? "size-28 rounded-full" : "min-h-36"}`}>
        {preview ? <div aria-label={`${label} preview`} className="absolute inset-0 bg-cover bg-center" role="img" style={{ backgroundImage: `url("${preview}")` }} /> : <div className="grid h-full min-h-36 place-items-center px-4 text-center text-sm text-brand-ink-soft">No {label.toLowerCase()} yet.</div>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center bg-brand-ink px-4 text-[0.72rem] font-black tracking-[0.07em] text-white uppercase hover:bg-brand-blue hover:text-brand-ink">
          {uploading === kind ? `Uploading ${progress}%` : preview ? "Replace" : "Choose image"}
          <input accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" disabled={Boolean(uploading)} onChange={(event) => onChange(kind, event)} type="file" />
        </label>
        {onRemove ? <button className="border-b-2 border-current pb-1 text-[0.7rem] font-black tracking-[0.07em] uppercase hover:text-brand-red" onClick={onRemove} type="button">{kind === "avatar" ? "Use Google image" : "Remove"}</button> : null}
      </div>
      {uploading === kind ? <p className="text-xs font-black tracking-[0.1em] text-brand-blue uppercase">Uploading directly to R2…</p> : null}
      {error ? <p className="text-sm text-brand-red" role="alert">{error}</p> : null}
    </div>
  );
}

function Field({ label, name, defaultValue, error, hint, required = false, type = "text", placeholder }: { label: string; name: string; defaultValue: string; error?: string; hint?: string; required?: boolean; type?: string; placeholder?: string }) {
  const errorId = `${name}-error`;
  return <label className="grid gap-2 text-[0.7rem] font-black tracking-[0.12em] uppercase">{label}<input aria-describedby={error ? errorId : undefined} className="min-h-12 border border-[var(--line)] bg-white px-4 text-base font-normal tracking-normal normal-case outline-none focus:border-brand-blue" defaultValue={defaultValue} name={name} placeholder={placeholder} required={required} type={type} />{hint ? <span className="text-xs font-normal tracking-normal text-brand-ink-soft normal-case">{hint}</span> : null}{error ? <span className="text-xs font-normal tracking-normal text-brand-red normal-case" id={errorId}>{error}</span> : null}</label>;
}
