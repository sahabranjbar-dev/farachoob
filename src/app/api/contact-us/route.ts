import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export interface Body {
  name: string;
  email: string;
  message: string;
  captcha: string;
}
const ContactUsSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر نیست"),
  message: z.string().min(5, "پیام باید حداقل ۵ کاراکتر باشد"),
  captcha: z.string().min(1, "کد امنیتی الزامی است"),
});
export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();

    const parsed = ContactUsSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message;
      return NextResponse.json({ error: firstError }, { status: 422 });
    }
    const captcha = request.cookies.get("captcha");

    const { captcha: inputCaptcha, email, message, name } = parsed.data;
    if (captcha?.value !== inputCaptcha)
      return NextResponse.json(
        {
          message: "کد امنیتی وارد شده اشتباه است",
        },
        {
          status: 422,
        }
      );

    const contactMessageData = await prisma?.contactMessage?.create({
      data: {
        email,
        message,
        name,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        message: "پیام با موفقیت ارسال شد",
        description: `همکاران ما به زودی با شما تماس خواهند گرفت`,
        ...contactMessageData,
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
