"use server";

import { signOut } from "@/auth";

export async function memberSignOutAction() {
  await signOut({ redirectTo: "/" });
}
