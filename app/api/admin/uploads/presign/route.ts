import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import {
  createEventCoverUpload,
  getEventCoverImageExtension,
  getStorageConfigurationErrorMessage,
  isValidEventCoverImageSize,
  isValidEventCoverImageType,
} from "@/lib/storage/r2";

type PresignRequest = {
  contentType?: unknown;
  size?: unknown;
};

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
  const objectKey = `events/${randomUUID()}/${randomUUID()}.${extension}`;

  try {
    return NextResponse.json(await createEventCoverUpload(objectKey, contentType));
  } catch (error) {
    return NextResponse.json({ error: getStorageConfigurationErrorMessage(error) }, { status: 500 });
  }
}
