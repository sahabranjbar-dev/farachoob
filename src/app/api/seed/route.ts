// app/api/seed/route.ts (Next.js App Router)

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    // نقش‌های پایه
    const roles = [
      { englishTitle: "admin", farsiTitle: "ادمین" },
      { englishTitle: "manager", farsiTitle: "مدیر" },
      { englishTitle: "customer", farsiTitle: "مشتری" },
    ];

    for (const role of roles) {
      const exists = await prisma.role.findUnique({
        where: { englishTitle: role.englishTitle },
      });
      if (!exists) {
        await prisma.role.create({ data: role });
      }
    }

    // چک کردن اینکه آیا مدیر وجود داره
    const adminUser = await prisma.user.findFirst({
      where: { role: { englishTitle: "manager" } },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("1qaz!QAZ", 14);

      await prisma.user.create({
        data: {
          name: "sahab ranjbar",
          email: "sahab@g.com",
          password: hashedPassword,
          role: {
            connect: { englishTitle: "manager" },
          },
        },
      });
    }

    return NextResponse.json({ message: "Seed data applied" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطا در اعمال داده‌ها" },
      { status: 500 }
    );
  }
}
