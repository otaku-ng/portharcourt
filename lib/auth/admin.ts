import { UserRole, type Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

const adminUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  profile: {
    select: {
      displayName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.UserSelect;

export type AdminContext = Prisma.UserGetPayload<{ select: typeof adminUserSelect }>;

function safeCallbackUrl(callbackUrl: string): string {
  return callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/admin";
}

/** Resolve the signed-in user and current PostgreSQL role. */
export async function getAdminContext(): Promise<AdminContext | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: adminUserSelect,
  });
}

export async function requireAdmin(callbackUrl = "/admin"): Promise<AdminContext | null> {
  const context = await getAdminContext();
  if (!context) {
    const session = await auth();
    if (!session?.user?.id) {
      redirect(`/signin?callbackUrl=${encodeURIComponent(safeCallbackUrl(callbackUrl))}`);
    }
    return null;
  }

  return context.role === UserRole.ADMIN || context.role === UserRole.SUPER_ADMIN ? context : null;
}

export async function requireSuperAdmin(callbackUrl = "/admin/admins"): Promise<AdminContext | null> {
  const context = await requireAdmin(callbackUrl);
  return context?.role === UserRole.SUPER_ADMIN ? context : null;
}

export function adminRoleLabel(role: UserRole): string {
  return role === UserRole.SUPER_ADMIN ? "SUPER ADMIN" : "ADMIN";
}
