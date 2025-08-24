// /app/api/seed-roles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_SECRET = process.env.SEED_SECRET_KEY;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");

    if (secret !== ALLOWED_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ایجاد یا آپدیت نقش Admin
    const adminRole = await prisma.role.upsert({
      where: { englishTitle: "admin" },
      update: { farsiTitle: "ادمین" },
      create: { englishTitle: "admin", farsiTitle: "ادمین" },
    });

    // ایجاد یا آپدیت نقش Manager
    const managerRole = await prisma.role.upsert({
      where: { englishTitle: "manager" },
      update: { farsiTitle: "مدیر" },
      create: { englishTitle: "manager", farsiTitle: "مدیر" },
    });

    // ایجاد یا آپدیت نقش User
    const userRole = await prisma.role.upsert({
      where: { englishTitle: "user" },
      update: { farsiTitle: "کاربر" },
      create: { englishTitle: "user", farsiTitle: "کاربر" },
    });

    return NextResponse.json({
      message: "Roles created successfully",
      roles: [adminRole, managerRole, userRole],
    });
  } catch (err) {
    console.error("❌ Failed to seed roles", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
