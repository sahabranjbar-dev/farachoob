import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RolesTable from "@/components/RolesTable"; // فرض می‌کنیم این کامپوننت رو داری

export default async function RolesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
    return null;
  }

  const userEmail = session.user.email;
  if (!userEmail) {
    redirect("/auth/login");
    return null;
  }

  // مسیر صفحه
  const currentPath = "manager/roles";

  // گرفتن منو + پرمیشن این صفحه
  const menu = await prisma.menu.findFirst({
    where: { href: currentPath, status: true },
    include: { permission: true },
  });

  if (!menu || !menu.permission) {
    // redirect("/dashboard/unauthorized");
    return null;
  }

  // گرفتن رول‌ها و پرمیشن‌های کاربر از دیتابیس (بر اساس ایمیل کاربر)
  const userWithRoles = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // if (!userWithRoles) {
  //   redirect("/dashboard/unauthorized");
  //   return null;
  // }

  // // استخراج پرمیشن‌های کاربر از رول‌ها
  // const userPermissions = userWithRoles.roles.flatMap((ur) =>
  //   ur.role.permissions.map((rp) => rp.permission.name)
  // );

  // // چک کردن پرمیشن صفحه
  // if (!userPermissions.includes(menu.permission.name)) {
  //   redirect("/dashboard/unauthorized");
  //   return null;
  // }

  // حالا همه نقش‌ها را بگیر (برای نمایش)
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      farsiTitle: true,
      englishTitle: true,
      description: true,
      status: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return <RolesTable roles={roles} />;
}
