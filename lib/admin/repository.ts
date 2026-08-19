import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const adminUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  profile: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.UserSelect;

type AdminUserRecord = Prisma.UserGetPayload<{ select: typeof adminUserSelect }>;

export type AdminUserDto = {
  userId: string;
  email: string | null;
  displayName: string;
  username: string | null;
  avatar: string | null;
  role: UserRole;
};

function toAdminUserDto(user: AdminUserRecord): AdminUserDto {
  return {
    userId: user.id,
    email: user.email,
    displayName: user.profile?.displayName ?? user.name ?? user.email ?? "PH Otakus member",
    username: user.profile?.username ?? null,
    avatar: user.profile?.avatarUrl ?? user.image,
    role: user.role,
  };
}

const adminWhere = (role: UserRole): Prisma.UserWhereInput => ({ role });

export async function getAdminsByRole(role: UserRole): Promise<AdminUserDto[]> {
  const users = await prisma.user.findMany({
    where: adminWhere(role),
    orderBy: [{ name: "asc" }, { email: "asc" }],
    select: adminUserSelect,
  });

  return users.map(toAdminUserDto);
}

export async function searchUsersForAdmin(query: string): Promise<AdminUserDto[]> {
  const search = query.trim().slice(0, 80);
  if (!search) return [];

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { profile: { is: { username: { contains: search, mode: "insensitive" } } } },
        { profile: { is: { displayName: { contains: search, mode: "insensitive" } } } },
      ],
    },
    orderBy: [{ name: "asc" }, { email: "asc" }],
    take: 50,
    select: adminUserSelect,
  });

  return users.map(toAdminUserDto);
}
