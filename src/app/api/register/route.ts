import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

// فقط متد POST رو هندل می‌کنیم
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // چک کردن کامل بودن اطلاعات
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "لطفا همه فیلدها را کامل کنید." },
        { status: 400 }
      );
    }

    // چک کردن اینکه کاربر قبلا ثبت‌نام نکرده باشه
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "این ایمیل قبلا ثبت شده است." },
        { status: 409 }
      );
    }

    // رمزنگاری رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ذخیره کاربر جدید
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
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
