import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const R2_UPLOAD_EXPIRES_IN_SECONDS = 5 * 60;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_EVENT_COVER_IMAGE_BYTES = MAX_IMAGE_BYTES;

export const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export const EVENT_COVER_IMAGE_TYPES = IMAGE_TYPES;

export type ImageContentType = keyof typeof IMAGE_TYPES;
export type EventCoverImageType = ImageContentType;

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
};

let client: S3Client | undefined;

function getR2Config(): R2Config {
  const values = {
    accountId: process.env.R2_ACCOUNT_ID?.trim(),
    accessKeyId: process.env.R2_ACCESS_KEY_ID?.trim(),
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY?.trim(),
    bucketName: process.env.R2_BUCKET_NAME?.trim(),
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/$/, ""),
  };

  if (Object.values(values).some((value) => !value)) {
    throw new Error("R2 storage is not configured.");
  }

  let publicUrl: URL;
  try {
    publicUrl = new URL(values.publicBaseUrl!);
  } catch {
    throw new Error("R2_PUBLIC_BASE_URL is invalid.");
  }

  if (
    (publicUrl.protocol !== "https:" && publicUrl.protocol !== "http:") ||
    publicUrl.search ||
    publicUrl.hash
  ) {
    throw new Error("R2_PUBLIC_BASE_URL must use HTTP or HTTPS.");
  }

  return {
    accountId: values.accountId!,
    accessKeyId: values.accessKeyId!,
    secretAccessKey: values.secretAccessKey!,
    bucketName: values.bucketName!,
    publicBaseUrl: values.publicBaseUrl!,
  };
}

function getR2Client(config: R2Config): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  return client;
}

export function getEventCoverImageExtension(contentType: string): string | null {
  return IMAGE_TYPES[contentType as ImageContentType] ?? null;
}

export function isValidEventCoverImageType(contentType: string): contentType is EventCoverImageType {
  return getEventCoverImageExtension(contentType) !== null;
}

export function isValidEventCoverImageSize(size: number): boolean {
  return Number.isSafeInteger(size) && size > 0 && size <= MAX_IMAGE_BYTES;
}

export function isSafeEventObjectKey(objectKey: string): boolean {
  return /^events\/[A-Za-z0-9_-]+\/[0-9a-f-]{36}\.(jpg|png|webp|avif)$/.test(objectKey);
}

function isSafeScopedObjectKey(objectKey: string, folder: "gallery" | "stories"): boolean {
  return new RegExp(`^${folder}/[A-Za-z0-9_-]+/[0-9a-f-]{36}\\.(jpg|png|webp|avif)$`).test(objectKey);
}

export function isSafeGalleryObjectKey(objectKey: string): boolean {
  return isSafeScopedObjectKey(objectKey, "gallery");
}

export function isSafeStoryObjectKey(objectKey: string): boolean {
  return isSafeScopedObjectKey(objectKey, "stories");
}

export function getPublicUrlForObjectKey(objectKey: string): string {
  if (!isSafeEventObjectKey(objectKey) && !isSafeGalleryObjectKey(objectKey) && !isSafeStoryObjectKey(objectKey)) {
    throw new Error("Invalid image object key.");
  }

  return `${getR2Config().publicBaseUrl}/${objectKey}`;
}

export function getPublicUrlForEventObjectKey(objectKey: string): string {
  if (!isSafeEventObjectKey(objectKey)) {
    throw new Error("Invalid event image object key.");
  }

  return getPublicUrlForObjectKey(objectKey);
}

export async function createImageUpload(objectKey: string, contentType: ImageContentType) {
  const config = getR2Config();
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: objectKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getR2Client(config), command, {
    expiresIn: R2_UPLOAD_EXPIRES_IN_SECONDS,
  });

  return {
    uploadUrl,
    objectKey,
    publicUrl: `${config.publicBaseUrl}/${objectKey}`,
  };
}

export async function createEventCoverUpload(objectKey: string, contentType: EventCoverImageType) {
  return createImageUpload(objectKey, contentType);
}

export function getStorageConfigurationErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.includes("R2")) {
    return "Image storage is not configured. Add the R2 environment variables before uploading.";
  }

  return "Could not prepare image storage. Try again.";
}
