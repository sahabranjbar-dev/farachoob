import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const ALLOWED_SECRET = process.env.SEED_SECRET_KEY;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (secret !== ALLOWED_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // ⬛️ نقش‌ها
    const roles = [
      { englishTitle: "admin", farsiTitle: "ادمین" },
      { englishTitle: "manager", farsiTitle: "مدیر" },
      { englishTitle: "customer", farsiTitle: "مشتری" },
    ];

    for (const role of roles) {
      await prisma.role.upsert({
        where: { englishTitle: role.englishTitle! },
        update: {},
        create: role,
      });
    }

    // ⬛️ پرمیشن‌ها
    const permissions = [
      { name: "مدیریت کاربران", description: "مدیریت کاربران سیستم" },
      { name: "مدیریت محصولات", description: "مدیریت محصولات فروشگاه" },
      { name: "مدیریت سفارشات", description: "مدیریت سفارشات مشتریان" },
      {
        name: "مدیریت دسته‌بندی‌ها",
        description: "مدیریت دسته‌بندی‌های محصولات",
      },
      { name: "مدیریت نظرات", description: "مدیریت نظرات مشتریان" },
      {
        name: "مدیریت تخفیف‌ها",
        description: "مدیریت کدهای تخفیف و پیشنهادات ویژه",
      },
      { name: "مدیریت گزارشات", description: "مشاهده و مدیریت گزارشات سیستم" },
      { name: "مدیریت تنظیمات", description: "تنظیمات کلی سیستم و فروشگاه" },
      { name: "مدیریت مالی", description: "مدیریت تراکنش‌ها و مالیات‌ها" },
      { name: "مدیریت محتوا", description: "مدیریت محتوای سایت و بلاگ" },
      {
        name: "مدیریت اعلان‌ها",
        description: "مدیریت اعلان‌ها و پیام‌های سیستم",
      },
      {
        name: "مدیریت نقش‌ها",
        description: "مدیریت نقش‌ها و دسترسی‌ها در سیستم",
      },
      {
        name: "مدیریت پرمیشن‌ها",
        description: "مدیریت پرمیشن‌ها و دسترسی‌های سیستم",
      },
      { name: "مدیریت منو", description: "مدیریت منوها و ناوبری سایت" },
      {
        name: "مدیریت آمار و تحلیل‌ها",
        description: "مشاهده آمار و تحلیل‌های فروشگاه",
      },
      {
        name: "مدیریت لاگ‌ها",
        description: "مشاهده لاگ‌ها و تاریخچه فعالیت‌ها",
      },
    ];

    for (const permission of permissions) {
      await prisma.permission.upsert({
        where: { name: permission.name },
        update: {},
        create: permission,
      });
    }

    // ⬛️ اتصال پرمیشن‌ها به نقش‌ها
    const rolePermissionsMap: Record<string, string[]> = {
      admin: ["مدیریت کاربران", "مدیریت محصولات", "مدیریت تنظیمات"],
      manager: [
        "مدیریت سفارشات",
        "مدیریت دسته‌بندی‌ها",
        "مدیریت گزارشات",
        "مدیریت منو",
        "مدیریت کاربران",
        "مدیریت محصولات",
        "مدیریت سفارشات",
        "مدیریت دسته‌بندی‌ها",
        "مدیریت نظرات",
        "مدیریت تخفیف‌ها",
        "مدیریت گزارشات",
        "مدیریت تنظیمات",
        "مدیریت مالی",
        "مدیریت محتوا",
        "مدیریت اعلان‌ها",
        "مدیریت نقش‌ها",
        "مدیریت پرمیشن‌ها",
        "مدیریت منو",
        "مدیریت آمار و تحلیل‌ها",
        "مدیریت لاگ‌ها",
      ],
      customer: ["مدیریت نظرات", "مدیریت تخفیف‌ها"],
    };

    for (const [roleKey, permissionNames] of Object.entries(
      rolePermissionsMap
    )) {
      const role = await prisma.role.findUnique({
        where: { englishTitle: roleKey },
      });
      const perms = await prisma.permission.findMany({
        where: { name: { in: permissionNames } },
      });

      if (role) {
        for (const perm of perms) {
          await prisma.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: perm.id,
              },
            },
            update: {},
            create: {
              roleId: role.id,
              permissionId: perm.id,
            },
          });
        }
      }
    }

    // ⬛️ منوها
    const menus = [
      {
        title: "مدیریت کاربران",
        href: "/users",
        permissionName: "مدیریت کاربران",
      },
      { title: "مدیریت منو‌ها", href: "/menus", permissionName: "مدیریت منو" },
      {
        title: "مدیریت نقش‌ها",
        href: "/roles",
        permissionName: "مدیریت نقش‌ها",
      },
      {
        title: "مدیریت دسترسی‌ها",
        href: "/permissions",
        permissionName: "مدیریت پرمیشن‌ها",
      },
    ];

    for (const menu of menus) {
      const permission = await prisma.permission.findUnique({
        where: { name: menu.permissionName },
      });

      if (permission) {
        await prisma.menu.upsert({
          where: { href: menu.href },
          update: {},
          create: {
            title: menu.title,
            href: menu.href,
            permissionId: permission.id,
          },
        });
      }
    }

    // ⬛️ کاربران پیش‌فرض
    const defaultUsers = [
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "admin1234",
        mobile: "+989000000001",
        role: "admin",
      },
      {
        firstName: "sahab",
        lastName: "ranjbar",
        email: "amirisahab@gmail.com",
        password: "Sahab123!",
        mobile: "+989111105440",
        role: "manager",
      },
      {
        firstName: "Customer",
        lastName: "User",
        email: "customer@example.com",
        password: "customer1234",
        mobile: "+989000000003",
        role: "customer",
      },
    ];

    for (const user of defaultUsers) {
      const exists = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!exists) {
        const role = await prisma.role.findUnique({
          where: { englishTitle: user.role },
        });

        if (!role) throw new Error(`نقش ${user.role} یافت نشد`);

        const hashedPassword = await bcrypt.hash(user.password, 14);

        await prisma.user.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            password: hashedPassword,
            roleId: role.id,
          },
        });
      }
    }

    return NextResponse.json({ message: "✅ Seed data applied successfully" });
  } catch (error) {
    console.error("❌ Error in seeding:", error);
    return NextResponse.json(
      { message: "خطا در اعمال داده‌ها" },
      { status: 500 }
    );
  }
}
