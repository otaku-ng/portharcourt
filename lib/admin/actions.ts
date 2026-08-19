"use server";

import { Prisma, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireSuperAdmin } from "@/lib/auth/admin";

export type RoleActionState = {
  error?: string;
};

const roleSchema = z.enum([UserRole.MEMBER, UserRole.ADMIN, UserRole.SUPER_ADMIN]);

function formString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateUserRoleAction(
  _previousState: RoleActionState,
  formData: FormData,
): Promise<RoleActionState> {
  const actor = await requireSuperAdmin("/admin/admins");
  if (!actor) return { error: "Only a super admin can change administrator roles." };

  const targetUserId = formString(formData, "userId");
  const parsedRole = roleSchema.safeParse(formString(formData, "role"));
  if (!targetUserId || !parsedRole.success) return { error: "The role change request was invalid." };

  try {
    await prisma.$transaction(async (transaction) => {
      const target = await transaction.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, role: true },
      });
      if (!target) throw new Error("That member could not be found.");

      const nextRole = parsedRole.data;
      if (target.role === nextRole) return;

      if (target.role === UserRole.SUPER_ADMIN && nextRole !== UserRole.SUPER_ADMIN) {
        const superAdminCount = await transaction.user.count({ where: { role: UserRole.SUPER_ADMIN } });
        if (superAdminCount <= 1) throw new Error("At least one super admin must remain.");
      }

      await transaction.user.update({
        where: { id: target.id },
        data: { role: nextRole },
      });

      console.info("[admin] User role changed", {
        actorUserId: actor.id,
        targetUserId: target.id,
        previousRole: target.role,
        newRole: nextRole,
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (error) {
    if (error instanceof Error && error.message === "At least one super admin must remain.") {
      return { error: error.message };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return { error: "This role change conflicted with another change. Try again." };
    }
    return { error: error instanceof Error ? error.message : "The role could not be updated." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/admins");
  redirect("/admin/admins");
}
