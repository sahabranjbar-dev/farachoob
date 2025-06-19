import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UsersTable from "@/components/UsersTable";

interface UserSession {
  name: string;
  email: string;
  roles: string[]; // آرایه نقش‌ها
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  // اگر سشن نیست => هدایت به صفحه ورود
  if (!session) {
    redirect("/auth/login");
    return null; // برای جلوگیری از ادامه اجرا
  }

  // تایپ کردن user و چک کردن roles به صورت ایمن
  const user = session.user as unknown as UserSession;

  // بررسی نقش‌ها (اگر roles وجود ندارد یا نقش‌ها ادمین یا منیجر نبود => هدایت به صفحه unauthorized)
  if (
    !user.roles ||
    !Array.isArray(user.roles) ||
    (!user.roles.includes("ADMIN") && !user.roles.includes("MANAGER"))
  ) {
    redirect("/dashboard/unauthorized");
    return null;
  }

  // گرفتن لیست کاربران از دیتابیس
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // تبدیل نقش‌ها به آرایه رشته‌ای فقط نام نقش‌ها
  const usersData = users.map((u) => ({
    ...u,
    id: u.id.toString(),
    name: u.name ?? "بدون نام", // 👈 اگر name برابر null بود، مقدار جایگزین می‌دیم
    roles: u.roles.map((ur) => ur.role.name),
    createdAt: u.createdAt.toISOString(),
  }));

  return <UsersTable users={usersData} />;
}
