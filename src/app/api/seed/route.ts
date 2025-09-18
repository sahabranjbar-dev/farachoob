// prisma?/seed.ts

import { MENU_CONFIG, PermissionKey } from "@/constants/MENU_CONFIG";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ALLOWED_SECRET = process.env.SEED_SECRET_KEY;

export async function GET(request: NextRequest) {
  console.log("🌱 Seeding database...");
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (secret !== ALLOWED_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  // 1. ایجاد نقش‌ها
  const [adminRole, managerRole, customerRole] = await Promise.all([
    prisma?.role.upsert({
      where: { englishTitle: "admin" },
      update: {},
      create: { englishTitle: "admin", farsiTitle: "ادمین" },
    }),
    prisma?.role.upsert({
      where: { englishTitle: "manager" },
      update: {},
      create: { englishTitle: "manager", farsiTitle: "مدیر" },
    }),
    prisma?.role.upsert({
      where: { englishTitle: "customer" },
      update: {},
      create: { englishTitle: "customer", farsiTitle: "کاربر" },
    }),
  ]);

  // 2. ساخت Permission ها
  const allPermissions: PermissionKey[] = Object.values(PermissionKey);
  const permissionRecords = await Promise.all(
    allPermissions.map((p) =>
      prisma?.permission.upsert({
        where: { permissionKey: p },
        update: {},
        create: { permissionKey: p, title: p },
      })
    )
  );

  // 3. ساخت منوها و اتصال به Permission
  for (const [menuKey, menu] of Object.entries(MENU_CONFIG)) {
    const permission = await prisma?.permission.findUnique({
      where: { permissionKey: menu.permissions.view },
    });

    if (!permission) continue;

    await prisma?.menu.upsert({
      where: { href: menu.href },
      update: {},
      create: {
        title: menu.title,
        href: menu.href,
        icon: menu.icon,
        permissionId: permission.id,
      },
    });
  }

  // 4. اتصال تمام Permission ها به نقش admin
  await Promise.all(
    permissionRecords.map((perm) =>
      prisma?.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole?.id ?? "",
            permissionId: perm?.id ?? "",
          },
        },
        update: {},
        create: {
          roleId: adminRole?.id ?? "",
          permissionId: perm?.id ?? "",
        },
      })
    )
  );

  // 5. ساخت کاربر ادمین پیش‌فرض
  const hashedPassword = await bcrypt.hash("Sahab123ranjbar!", 10);
  await prisma?.user.upsert({
    where: { email: "amirisahab@gmail.com" },
    update: {},
    create: {
      email: "amirisahab@gmail.com",
      password: hashedPassword,
      firstName: "سحاب",
      lastName: "رنجبر",
      roleId: adminRole?.id ?? "",
    },
  });

  console.log("✅ Seeding finished.");
  return NextResponse.json("success");
}
