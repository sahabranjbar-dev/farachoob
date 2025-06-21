// app/manager/users/page.tsx

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

  const userPermissions = session.user.permissions || [];
  if (!userPermissions.includes(menu.permission.name)) {
    redirect("/dashboard/unauthorized");
    return null;
  }

  // صفحه فقط مجوز رو چک میکنه و بقیه رو میسپره به کامپوننت
  return <UsersTable />;
}
