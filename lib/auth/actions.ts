"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthConfigured,
  verifyAdminPassword,
} from "@/lib/auth/admin";

export type AdminLoginState = {
  error?: string;
};

function getSafeNextPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/admin/events";
  return value.startsWith("/admin/") && !value.startsWith("//") ? value : "/admin/events";
}

export async function loginAction(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  if (!isAdminAuthConfigured()) {
    return { error: "Admin login is not configured. Add ADMIN_PASSWORD and a 32+ character ADMIN_SESSION_SECRET." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !password) {
    return { error: "Enter the admin password." };
  }

  if (!verifyAdminPassword(password)) {
    return { error: "That password is not valid." };
  }

  try {
    await createAdminSession();
  } catch {
    return { error: "Could not start the admin session. Try again." };
  }

  redirect(getSafeNextPath(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
