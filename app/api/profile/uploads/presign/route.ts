import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getMember } from "@/lib/auth/member";
import {
  createProfileMediaUpload,
  getEventCoverImageExtension,
  getStorageConfigurationErrorMessage,
  isValidEventCoverImageType,
  MAX_PROFILE_AVATAR_BYTES,
  MAX_PROFILE_BANNER_BYTES,
} from "@/lib/storage/r2";

export async function POST(request: Request) {
  const member = await getMember();
  if (!member) return NextResponse.json({ error: "Sign in to upload profile media." }, { status: 401 });

  let body: { contentType?: unknown; size?: unknown; kind?: unknown };
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid");
    body = parsed as { contentType?: unknown; size?: unknown; kind?: unknown };
  } catch {
    return NextResponse.json({ error: "The upload request was invalid." }, { status: 400 });
  }

  const kind = body.kind === "avatar" || body.kind === "banner" ? body.kind : null;
  const contentType = typeof body.contentType === "string" ? body.contentType : "";
  const size = typeof body.size === "number" ? body.size : NaN;
  if (!kind) return NextResponse.json({ error: "The profile media type was invalid." }, { status: 400 });
  if (!isValidEventCoverImageType(contentType)) return NextResponse.json({ error: "Use a JPEG, PNG, WebP or AVIF image." }, { status: 400 });

  const maxBytes = kind === "avatar" ? MAX_PROFILE_AVATAR_BYTES : MAX_PROFILE_BANNER_BYTES;
  if (!Number.isSafeInteger(size) || size <= 0 || size > maxBytes) {
    return NextResponse.json({ error: `${kind === "avatar" ? "Avatar" : "Banner"} images must be no more than ${kind === "avatar" ? "5" : "10"} MB.` }, { status: 400 });
  }

  const extension = getEventCoverImageExtension(contentType);
  if (!extension) return NextResponse.json({ error: "The image type was invalid." }, { status: 400 });

  const objectKey = `profiles/${member.userId}/${kind}/${randomUUID()}.${extension}`;
  try {
    return NextResponse.json(await createProfileMediaUpload(objectKey, contentType));
  } catch (error) {
    return NextResponse.json({ error: getStorageConfigurationErrorMessage(error) }, { status: 500 });
  }
}
