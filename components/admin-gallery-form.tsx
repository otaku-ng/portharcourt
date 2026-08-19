"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useActionState } from "react";
import type { GalleryActionState } from "@/lib/gallery/actions";
import type { GalleryEventOption } from "@/lib/gallery/types";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxImageSize = 10 * 1024 * 1024;

type GalleryFormImage = {
  clientId: string;
  id?: string;
  objectKey?: string;
  url: string;
  alt: string;
  caption: string;
};

export type AdminGalleryFormData = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  eventId: string;
  date: string;
  published: boolean;
  images: GalleryFormImage[];
};

type GalleryAction = (
  state: GalleryActionState,
  formData: FormData,
) => Promise<GalleryActionState>;

function uploadFile(uploadUrl: string, file: File, onProgress: (value: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", uploadUrl);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error("The image upload was rejected."));
    };
    request.onerror = () => reject(new Error("The image could not be uploaded."));
    request.send(file);
  });
}

export function AdminGalleryForm({
  initial,
  events,
  action,
}: {
  initial: AdminGalleryFormData;
  events: GalleryEventOption[];
  action: GalleryAction;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [images, setImages] = useState<GalleryFormImage[]>(initial.images);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    if (!initial.id) {
      setUploadError("Save the album first, then add images from its edit page.");
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      for (const file of files) {
        setUploadingName(file.name);
        setUploadProgress(0);
        setUploadPreview(URL.createObjectURL(file));

        if (!allowedTypes.has(file.type)) throw new Error("Use JPEG, PNG, WebP or AVIF images.");
        if (file.size <= 0 || file.size > maxImageSize) throw new Error("Each image must be no more than 10 MB.");

        const response = await fetch("/api/admin/uploads/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "gallery-image", ownerId: initial.id, contentType: file.type, size: file.size }),
        });
        const result = (await response.json()) as { uploadUrl?: string; objectKey?: string; publicUrl?: string; error?: string };
        if (!response.ok || !result.uploadUrl || !result.objectKey || !result.publicUrl) {
          throw new Error(result.error || "Could not authorize the image upload.");
        }

        await uploadFile(result.uploadUrl, file, setUploadProgress);
        setImages((current) => [
          ...current,
          {
            clientId: result.objectKey!,
            objectKey: result.objectKey,
            url: result.publicUrl!,
            alt: "",
            caption: "",
          },
        ]);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "The images could not be uploaded.");
    } finally {
      setUploading(false);
      setUploadingName(null);
      setUploadPreview(null);
    }
  }

  function updateImage(clientId: string, field: "alt" | "caption", value: string) {
    setImages((current) => current.map((image) => image.clientId === clientId ? { ...image, [field]: value } : image));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (uploading) {
      event.preventDefault();
      setUploadError("Wait for all image uploads to finish before saving.");
    }
  }

  const errorFor = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="grid gap-8" onSubmit={handleSubmit}>
      {initial.id ? <input name="id" type="hidden" value={initial.id} /> : null}
      <input name="images" type="hidden" value={JSON.stringify(images)} readOnly />

      <div className="grid gap-6 border-t border-[var(--line)] pt-6 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={initial.title} error={errorFor("title")} required />
        <Field label="Slug" name="slug" defaultValue={initial.slug} error={errorFor("slug")} hint="Leave blank to generate it from the title." />
        <Field label="Date" name="date" defaultValue={initial.date} error={errorFor("date")} type="date" />
        <label className="grid gap-2 text-[0.7rem] font-black tracking-[0.12em] uppercase">
          Associated event
          <select className="min-h-12 border border-[var(--line)] bg-white px-4 text-base font-normal tracking-normal normal-case outline-none focus:border-brand-blue" defaultValue={initial.eventId} name="eventId">
            <option value="">No associated event</option>
            {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
          </select>
          {errorFor("eventId") ? <span className="text-xs font-normal tracking-normal text-brand-red normal-case">{errorFor("eventId")}</span> : null}
        </label>
      </div>

      <label className="grid gap-2 text-[0.7rem] font-black tracking-[0.12em] uppercase">
        Description
        <textarea className="min-h-32 border border-[var(--line)] bg-white px-4 py-3 text-base font-normal tracking-normal normal-case outline-none focus:border-brand-blue" defaultValue={initial.description} name="description" />
        {errorFor("description") ? <span className="text-xs font-normal tracking-normal text-brand-red normal-case">{errorFor("description")}</span> : null}
      </label>

      <div className="border-t border-[var(--line)] pt-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[0.7rem] font-black tracking-[0.12em] uppercase">Album images</p>
            <p className="mt-2 text-sm text-brand-ink-soft">JPEG, PNG, WebP or AVIF. Maximum 10 MB each. Uploads run one at a time.</p>
          </div>
          <label className="inline-flex min-h-12 cursor-pointer items-center justify-center bg-brand-ink px-5 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase transition-colors hover:bg-brand-blue hover:text-brand-ink">
            {uploading ? `Uploading ${uploadProgress}%` : "Add images"}
            <input accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" disabled={uploading} multiple onChange={handleFiles} type="file" />
          </label>
        </div>
        {uploadingName ? <p className="mt-3 text-xs font-black tracking-[0.1em] text-brand-blue uppercase">Uploading {uploadingName} directly to R2…</p> : null}
        {uploadError ? <p className="mt-3 text-sm text-brand-red" role="alert">{uploadError}</p> : null}
        {errorFor("images") ? <p className="mt-3 text-sm text-brand-red" role="alert">{errorFor("images")}</p> : null}
        {uploadPreview ? <div className="relative mt-5 h-28 w-44 overflow-hidden bg-brand-paper-dark"><Image alt="Upload preview" className="object-cover" fill src={uploadPreview} unoptimized /></div> : null}

        {images.length === 0 ? (
          <p className="mt-6 border-t border-[var(--line)] pt-6 text-sm text-brand-ink-soft">No images yet. Save the album, then add the first image.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {images.map((image, index) => (
              <article className="grid gap-5 border-t border-[var(--line)] pt-4 md:grid-cols-[150px_minmax(0,1fr)_auto]" key={image.clientId}>
                <div className="relative h-28 overflow-hidden bg-brand-paper-dark">
                  <Image alt="" className="object-cover" fill sizes="150px" src={image.url} unoptimized />
                </div>
                <div className="grid gap-3">
                  <label className="grid gap-1 text-[0.65rem] font-black tracking-[0.1em] uppercase">Alt text<input className="min-h-11 border border-[var(--line)] bg-white px-3 text-sm font-normal tracking-normal normal-case outline-none focus:border-brand-blue" value={image.alt} onChange={(event) => updateImage(image.clientId, "alt", event.target.value)} /></label>
                  <label className="grid gap-1 text-[0.65rem] font-black tracking-[0.1em] uppercase">Caption <span className="font-normal tracking-normal normal-case text-brand-ink-soft">Optional</span><input className="min-h-11 border border-[var(--line)] bg-white px-3 text-sm font-normal tracking-normal normal-case outline-none focus:border-brand-blue" value={image.caption} onChange={(event) => updateImage(image.clientId, "caption", event.target.value)} /></label>
                </div>
                <div className="flex flex-wrap items-start gap-3 text-[0.68rem] font-black tracking-[0.08em] uppercase md:flex-col md:items-end">
                  <span className="text-brand-ink-soft">Image {String(index + 1).padStart(2, "0")}</span>
                  <button className="border-b-2 border-current pb-1 hover:text-brand-blue disabled:opacity-35" disabled={index === 0} onClick={() => moveImage(index, -1)} type="button">Move up</button>
                  <button className="border-b-2 border-current pb-1 hover:text-brand-blue disabled:opacity-35" disabled={index === images.length - 1} onClick={() => moveImage(index, 1)} type="button">Move down</button>
                  <button className="border-b-2 border-current pb-1 text-brand-red hover:text-brand-coral" onClick={() => setImages((current) => current.filter((item) => item.clientId !== image.clientId))} type="button">Remove</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <label className="flex items-start gap-3 border-t border-[var(--line)] pt-6 text-sm">
        <input className="mt-1 size-4 accent-brand-red" defaultChecked={initial.published} name="published" type="checkbox" />
        <span><strong className="block text-[0.7rem] font-black tracking-[0.12em] uppercase">Published</strong><span className="mt-1 block text-brand-ink-soft">Published albums appear on the public gallery and homepage.</span></span>
      </label>

      {state.error ? <p className="text-sm text-brand-red" role="alert">{state.error}</p> : null}
      <div className="flex flex-wrap items-center gap-4">
        <button className="inline-flex min-h-12 items-center justify-center bg-brand-red px-6 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase transition-colors hover:bg-brand-coral disabled:cursor-wait disabled:opacity-60" disabled={pending || uploading} type="submit">{pending ? "Saving…" : initial.id ? "Save changes" : "Create album"}</button>
        <span className="text-sm text-brand-ink-soft">Drafts stay private until you publish them.</span>
      </div>
    </form>
  );
}

function Field({ label, name, defaultValue, error, hint, required = false, type = "text" }: { label: string; name: string; defaultValue: string; error?: string; hint?: string; required?: boolean; type?: string }) {
  return (
    <label className="grid gap-2 text-[0.7rem] font-black tracking-[0.12em] uppercase">
      {label}
      <input className="min-h-12 border border-[var(--line)] bg-white px-4 text-base font-normal tracking-normal normal-case outline-none focus:border-brand-blue" defaultValue={defaultValue} name={name} required={required} type={type} />
      {hint ? <span className="text-xs font-normal tracking-normal text-brand-ink-soft normal-case">{hint}</span> : null}
      {error ? <span className="text-xs font-normal tracking-normal text-brand-red normal-case">{error}</span> : null}
    </label>
  );
}
