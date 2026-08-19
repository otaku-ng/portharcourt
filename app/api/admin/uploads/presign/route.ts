import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import {
  createEventCoverUpload,
  createImageUpload,
  getEventCoverImageExtension,
  getStorageConfigurationErrorMessage,
  isValidEventCoverImageSize,
  isValidEventCoverImageType,
} from "@/lib/storage/r2";

type PresignRequest = {
  contentType?: unknown;
  size?: unknown;
  kind?: unknown;
  ownerId?: unknown;
};

type UploadKind = "event-cover" | "gallery-image" | "story-cover";

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "You must be signed in as an admin." }, { status: 401 });
  }

  let body: PresignRequest;
  try {
    const parsedBody: unknown = await request.json();
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
      return NextResponse.json({ error: "The upload request was invalid." }, { status: 400 });
    }
    body = parsedBody as PresignRequest;
  } catch {
    return NextResponse.json({ error: "The upload request was invalid." }, { status: 400 });
  }

  const contentType = typeof body.contentType === "string" ? body.contentType : "";
  const size = typeof body.size === "number" ? body.size : NaN;
  const kind = typeof body.kind === "string" ? body.kind : "event-cover";
  const ownerId = typeof body.ownerId === "string" ? body.ownerId.trim() : "";

  if (!(["event-cover", "gallery-image", "story-cover"] as UploadKind[]).includes(kind as UploadKind)) {
    return NextResponse.json({ error: "The upload type was invalid." }, { status: 400 });
  }

  if (!isValidEventCoverImageType(contentType)) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG, WebP or AVIF image." },
      { status: 400 },
    );
  }

  if (!isValidEventCoverImageSize(size)) {
    return NextResponse.json(
      { error: "Cover images must be larger than 0 bytes and no more than 10 MB." },
      { status: 400 },
    );
  }

  const extension = getEventCoverImageExtension(contentType);
  if (!extension) {
    return NextResponse.json({ error: "The image type was invalid." }, { status: 400 });
  }

  let objectKey: string;
  if (kind === "event-cover") {
    objectKey = `events/${randomUUID()}/${randomUUID()}.${extension}`;
  } else {
    if (!/^[A-Za-z0-9_-]{1,80}$/.test(ownerId)) {
      return NextResponse.json({ error: "The upload owner was invalid." }, { status: 400 });
    }

    if (kind === "gallery-image") {
      try {
        const album = await prisma.galleryAlbum.findUnique({ where: { id: ownerId }, select: { id: true } });
        if (!album) return NextResponse.json({ error: "Save the gallery album before uploading images." }, { status: 400 });
      } catch {
        return NextResponse.json({ error: "The gallery album could not be verified." }, { status: 500 });
      }
    }

    objectKey = `${kind === "gallery-image" ? "gallery" : "stories"}/${ownerId}/${randomUUID()}.${extension}`;
  }

  try {
    return NextResponse.json(
      await (kind === "event-cover" ? createEventCoverUpload(objectKey, contentType) : createImageUpload(objectKey, contentType)),
    );
  } catch (error) {
    return NextResponse.json({ error: getStorageConfigurationErrorMessage(error) }, { status: 500 });
  }
}
