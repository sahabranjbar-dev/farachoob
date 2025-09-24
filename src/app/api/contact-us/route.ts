import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createNnotification } from "@/lib/sendNotification";
import { normalizePhoneNumber } from "@/lib/utils";

export interface Body {
  name: string;
  email: string;
  message: string;
  captcha: string;
  mobile: string;
}

const ContactUsSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر نیست"),
  message: z.string().min(5, "پیام باید حداقل ۵ کاراکتر باشد"),
  captcha: z.string().min(1, "کد امنیتی الزامی است"),
  mobile: z
    .string()
    .min(11, "شماره موبایل باید ۱۱ رقمی باشد")
    .max(11, "شماره موبایل باید ۱۱ رقمی باشد"),
});

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();

    const parsed = ContactUsSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message;
      return NextResponse.json({ message: firstError }, { status: 422 });
    }

    const captcha = request.cookies.get("captcha");

    const { captcha: inputCaptcha, email, message, name, mobile } = parsed.data;

    if (captcha?.value !== inputCaptcha) {
      return NextResponse.json(
        {
          message: "کد امنیتی وارد شده اشتباه است",
          reason: "captcha",
        },
        {
          status: 422,
        }
      );
    }

    // نرمالایز کردن شماره موبایل
    const normalizedMobile = normalizePhoneNumber(mobile);

    const contactMessageData = await prisma.contactMessage.create({
      data: {
        email,
        message,
        name,
        mobile: normalizedMobile,
      },
    });

    const adminUsersIds = await prisma.user.findMany({
      where: {
        role: {
          englishTitle: {
            in: ["admin", "manager"],
          },
        },
      },
      select: {
        id: true,
      },
    });

    // ارسال نوتیفیکیشن به صورت سریال برای جلوگیری از خطا
    for (const item of adminUsersIds) {
      try {
        await createNnotification(
          "پیام جدید در صفحه تماس با ما ارسال شد",
          item.id,
          "پیامی در فرم تماس با ما ایجاد شد"
        );
      } catch (notificationError) {
        console.error("Error sending notification:", notificationError);
        // ادامه دادن حتی اگر یک نوتیفیکیشن با خطا مواجه شد
      }
    }

    return NextResponse.json(
      {
        status: 200,
        messages: "پیام با موفقیت ارسال شد",
        description: `همکاران ما به زودی با شما تماس خواهند گرفت`,
        ...contactMessageData,
        adminUsersIds,
      },
      { status: 200 }
    );
  } catch (error: any) {
    NextResponse.json(
      { error: "خطای سرور رخ داده است", details: error?.message },
      { status: 500 }
    );
  }
}
