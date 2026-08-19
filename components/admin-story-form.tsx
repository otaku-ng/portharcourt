"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useActionState } from "react";
import type { StoryActionState } from "@/lib/stories/actions";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxImageSize = 10 * 1024 * 1024;

export type AdminStoryFormData = {
  id?: string;
  uploadId: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageKey: string;
  coverImageAlt: string;
  published: boolean;
};

type StoryAction = (
  state: StoryActionState,
  formData: FormData,
) => Promise<StoryActionState>;

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

export function AdminStoryForm({ initial, action }: { initial: AdminStoryFormData; action: StoryAction }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [coverImageUrl, setCoverImageUrl] = useState(initial.coverImageUrl);
  const [coverImageKey, setCoverImageKey] = useState(initial.coverImageKey);
  const [previewUrl, setPreviewUrl] = useState(initial.coverImageUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);
    if (!allowedTypes.has(file.type)) {
      setUploadError("Use a JPEG, PNG, WebP or AVIF image.");
      return;
    }
    if (file.size <= 0 || file.size > maxImageSize) {
      setUploadError("Cover images must be no more than 10 MB.");
      return;
    }

    const previousPreview = previewUrl;
    setUploading(true);
    setUploadProgress(0);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const response = await fetch("/api/admin/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "story-cover", ownerId: initial.uploadId, contentType: file.type, size: file.size }),
      });
      const result = (await response.json()) as { uploadUrl?: string; objectKey?: string; publicUrl?: string; error?: string };
      if (!response.ok || !result.uploadUrl || !result.objectKey || !result.publicUrl) {
        throw new Error(result.error || "Could not authorize the image upload.");
      }

      await uploadFile(result.uploadUrl, file, setUploadProgress);
      setCoverImageKey(result.objectKey);
      setCoverImageUrl(result.publicUrl);
      setPreviewUrl(result.publicUrl);
      setUploadProgress(100);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "The image could not be uploaded.");
      setPreviewUrl(previousPreview);
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (uploading) {
      event.preventDefault();
      setUploadError("Wait for the cover image upload to finish before saving.");
    }
  }

  const errorFor = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="grid gap-8" onSubmit={handleSubmit}>
      {initial.id ? <input name="id" type="hidden" value={initial.id} /> : null}
      <input name="coverImageKey" type="hidden" value={coverImageKey} readOnly />

      <div className="grid gap-6 border-t border-[var(--line)] pt-6 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={initial.title} error={errorFor("title")} required />
        <Field label="Slug" name="slug" defaultValue={initial.slug} error={errorFor("slug")} hint="Leave blank to generate it from the title." />
        <Field label="Category" name="category" defaultValue={initial.category} error={errorFor("category")} required />
        <Field label="Cover image alt text" name="coverImageAlt" defaultValue={initial.coverImageAlt} error={errorFor("coverImageAlt")} required />
      </div>

      <label className="grid gap-2 text-[0.7rem] font-black tracking-[0.12em] uppercase">
        Excerpt
        <textarea className="min-h-28 border border-[var(--line)] bg-white px-4 py-3 text-base font-normal tracking-normal normal-case outline-none focus:border-brand-blue" defaultValue={initial.excerpt} name="excerpt" required />
        {errorFor("excerpt") ? <span className="text-xs font-normal tracking-normal text-brand-red normal-case">{errorFor("excerpt")}</span> : null}
      </label>

      <label className="grid gap-2 text-[0.7rem] font-black tracking-[0.12em] uppercase">
        Markdown body
        <span className="text-xs font-normal tracking-normal text-brand-ink-soft normal-case">Use headings, paragraphs, lists, links, blockquotes and fenced code blocks. Raw HTML is shown as text.</span>
        <textarea className="min-h-[420px] border border-[var(--line)] bg-white px-4 py-3 font-mono text-sm font-normal tracking-normal normal-case outline-none focus:border-brand-blue" defaultValue={initial.content} name="content" required />
        {errorFor("content") ? <span className="text-xs font-normal tracking-normal text-brand-red normal-case">{errorFor("content")}</span> : null}
      </label>

      <div className="grid gap-5 border-t border-[var(--line)] pt-6 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div>
          <p className="text-[0.7rem] font-black tracking-[0.12em] uppercase">Cover image</p>
          <p className="mt-2 text-sm text-brand-ink-soft">JPEG, PNG, WebP or AVIF. Maximum 10 MB.</p>
          <label className="mt-5 inline-flex min-h-12 cursor-pointer items-center justify-center bg-brand-ink px-5 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase transition-colors hover:bg-brand-blue hover:text-brand-ink">
            {uploading ? `Uploading ${uploadProgress}%` : coverImageUrl ? "Replace cover" : "Choose cover"}
            <input accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" disabled={uploading} onChange={handleFileChange} type="file" />
          </label>
          {uploadError ? <p className="mt-3 text-sm text-brand-red" role="alert">{uploadError}</p> : null}
          {errorFor("coverImageKey") ? <p className="mt-3 text-sm text-brand-red" role="alert">{errorFor("coverImageKey")}</p> : null}
          {uploading ? <p className="mt-3 text-xs font-black tracking-[0.1em] text-brand-blue uppercase">Uploading directly to R2…</p> : null}
        </div>
        <div className="relative min-h-[240px] overflow-hidden bg-brand-paper-dark">
          {previewUrl ? <Image alt="Cover preview" className="object-cover" fill sizes="(max-width: 768px) 100vw, 60vw" src={previewUrl} unoptimized /> : <div className="grid min-h-[240px] place-items-center px-5 text-center text-sm text-brand-ink-soft">Choose an image to preview it here.</div>}
        </div>
      </div>

      <label className="flex items-start gap-3 border-t border-[var(--line)] pt-6 text-sm">
        <input className="mt-1 size-4 accent-brand-red" defaultChecked={initial.published} name="published" type="checkbox" />
        <span><strong className="block text-[0.7rem] font-black tracking-[0.12em] uppercase">Published</strong><span className="mt-1 block text-brand-ink-soft">Published stories appear on the public blog and homepage.</span></span>
      </label>

      {state.error ? <p className="text-sm text-brand-red" role="alert">{state.error}</p> : null}
      <div className="flex flex-wrap items-center gap-4">
        <button className="inline-flex min-h-12 items-center justify-center bg-brand-red px-6 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase transition-colors hover:bg-brand-coral disabled:cursor-wait disabled:opacity-60" disabled={pending || uploading} type="submit">{pending ? "Saving…" : initial.id ? "Save changes" : "Create story"}</button>
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
