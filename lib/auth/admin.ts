import { createHash, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "ph_otakus_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;
const MIN_SESSION_SECRET_LENGTH = 32;

export type AdminSession = {
  authenticated: true;
};

function getSessionSecret(): Uint8Array | null {
  const value = process.env.ADMIN_SESSION_SECRET?.trim();
  return value && value.length >= MIN_SESSION_SECRET_LENGTH ? new TextEncoder().encode(value) : null;
}

function getAdminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value ? value : null;
}

function safeEqual(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(getAdminPassword() && getSessionSecret());
}

export function verifyAdminPassword(password: string): boolean {
  const expectedPassword = getAdminPassword();
  return Boolean(expectedPassword && safeEqual(password, expectedPassword));
}

export async function createAdminSession(): Promise<void> {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("Admin session is not configured.");
  }

  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_TTL_SECONDS}s`)
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function requireAdmin(): Promise<AdminSession | null> {
  const secret = getSessionSecret();
  if (!secret) return null;

  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    return payload.authenticated === true ? { authenticated: true } : null;
  } catch {
    return null;
  }
}

export const adminSessionCookieName = ADMIN_SESSION_COOKIE;
