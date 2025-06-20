import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(roles);
  } catch {
    return NextResponse.json(
      { message: "خطا در دریافت نقش‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { description, farsiTitle, englishTitle, status } =
      await request.json();

    if (!englishTitle || typeof englishTitle !== "string") {
      return NextResponse.json(
        { message: "نام نقش معتبر نیست." },
        { status: 400 }
      );
    }

    const role = await prisma.role.create({
      data: { englishTitle, description, farsiTitle, status },
    });

    return NextResponse.json({
      resultlist: role,
      message: "نقش جدید با موفقیت ایجاد شد",
      status: 201,
    });
  } catch {
    return NextResponse.json({ message: "خطا در ایجاد نقش." }, { status: 500 });
  }
}
