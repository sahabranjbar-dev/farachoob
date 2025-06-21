import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "لطفا همه فیلدها را کامل کنید." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "این ایمیل قبلا ثبت شده است." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // پیدا کردن رول پیش‌فرض "مشتری"
    const customerRole = await prisma.role.findFirst({
      where: { englishTitle: "customer" }, // یا می‌تونی با farsiTitle جستجو کنی
    });

    if (!customerRole) {
      return NextResponse.json(
        { message: "نقش مشتری در دیتابیس پیدا نشد." },
        { status: 500 }
      );
    }

    // ساخت یوزر با رول پیش‌فرض
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: {
          create: [{ roleId: customerRole.id }],
        },
      },
    });

    return NextResponse.json(
      { message: "ثبت‌نام با موفقیت انجام شد." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "مشکلی در سرور پیش آمده است." },
      { status: 500 }
    );
  }
}
