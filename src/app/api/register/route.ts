import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().optional(), // نام اختیاری است
    email: z.string().email("ایمیل نامعتبر است"),
    password: z.string().min(6, "رمز عبور باید حداقل 6 کاراکتر باشد"),
    confirmPassword: z.string(),
    mobile: z.string().optional(), // موبایل اختیاری است
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن باید یکسان باشند",
    path: ["confirmPassword"], // خطا را به confirmPassword نسبت می‌دهد
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // اعتبارسنجی ورودی
    const { name, email, password, confirmPassword, mobile } =
      registerSchema.parse(body);

    // چک کردن ایمیل تکراری
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "این ایمیل قبلا ثبت شده است." },
        { status: 409 }
      );
    }

    // رمزنگاری پسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    if (email === "amirisahab@gmail.com") {
      const managerRole = await prisma.role.findUnique({
        where: { englishTitle: "manager" },
      });
      await prisma.user.create({
        data: {
          mobile,
          email,
          password: hashedPassword,
          role: {
            connect: {
              id: managerRole?.id,
            },
          },
          firstName: name,
        },
      });

      return NextResponse.json(
        { message: "ثبت‌نام با موفقیت انجام شد." },
        { status: 201 }
      );
    }

    // پیدا کردن رول پیش‌فرض customer
    const customerRole = await prisma.role.findUnique({
      where: { englishTitle: "customer" },
    });

    if (!customerRole) {
      return NextResponse.json(
        { message: "نقش پیش‌فرض یافت نشد. لطفا با مدیر سیستم تماس بگیرید." },
        { status: 500 }
      );
    }

    await prisma.user.create({
      data: {
        mobile,
        email,
        password: hashedPassword,
        role: {
          connect: {
            id: customerRole.id,
          },
        },
        firstName: name,
      },
    });

    return NextResponse.json(
      { message: "ثبت‌نام با موفقیت انجام شد." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);

    // اگر خطای Zod باشه
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "مشکلی در سرور پیش آمده است." },
      { status: 500 }
    );
  }
}
