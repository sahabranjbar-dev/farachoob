import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UsersTable from "@/components/UsersTable";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
    return null;
  }

  const currentPath = "manager/users";

  // گرفتن منو و مجوز صفحه
  const menu = await prisma.menu.findFirst({
    where: { href: currentPath, status: true },
    include: { permission: true },
  });

  if (!menu) {
    redirect("/dashboard/unauthorized");
    return null;
  }

  // بررسی مجوزهای کاربر
  const userPermissions = session.user.permissions || [];
  if (!userPermissions.includes(menu.permission.name)) {
    redirect("/dashboard/unauthorized");
    return null;
  }

  // گرفتن کاربران همراه با نقش‌ها (join با UserRole و Role)
  const users = await prisma.user.findMany({
    include: {
      roles: {
        include: {
          role: true, // برای دسترسی به داده‌های نقش
        },
      },
    },
  });

  // ساخت آرایه کاربران به فرمتی که کامپوننت UsersTable نیاز داره
  const usersData = users.map((user) => ({
    id: user.id,
    name: user.name ?? "",
    email: user.email,
    roles: user.roles.map((ur) => ur.role.englishTitle ?? ""),
    createdAt: user.createdAt.toISOString(),
  }));

  return <UsersTable users={usersData} />;
}
