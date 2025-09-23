import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";
import { createNnotification } from "@/lib/sendNotification";
import { normalizePhoneNumber } from "@/lib/utils";
import { useChat } from "../../../../stores";

// ✅ اسکیمای اعتبارسنجی
const formSchema = z.object({
  name: z.string().min(3),
  mobile: z.string().regex(/^09\d{9}$/),
  productType: z.string().min(2),
  dimensions: z.string().min(2),
  material: z.string().min(2),
  color: z.string(),
  description: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    // 📌 استخراج فیلدها
    const values = {
      name: formData.get("name") as string,
      mobile: formData.get("mobile")
        ? normalizePhoneNumber(formData.get("mobile") as string)
        : "",
      productType: formData.get("productType") as string,
      dimensions: formData.get("dimensions") as string,
      material: formData.get("material") as string,
      color: formData.get("color") as string,
      description: formData.get("description") as string | null,
      captcha: formData.get("captcha") as string,
    };

    // 📌 اعتبارسنجی با Zod
    const parsed = formSchema.parse(values);

    const storedCaptcha = req.cookies.get("captcha")?.value;

    if (
      !storedCaptcha ||
      storedCaptcha.toLowerCase() !== values.captcha.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "کپچا اشتباه است", reason: "captcha" },
        { status: 422 }
      );
    }
    // 📌 ایجاد سفارش در دیتابیس
    const request = await prisma.customDesignRequest.create({
      data: parsed,
    });

    // 📌 آپلود تصاویر در Cloudinary (تا ۱۰ تا)
    const files = formData.getAll("images") as File[];
    if (files && files.length > 0) {
      // فیلتر کردن فایل‌های خالی
      const validFiles = files.filter(
        (file) => file.size > 0 && file.name !== "undefined"
      );

      if (validFiles.length > 0) {
        const uploadedImages = await Promise.all(
          validFiles.slice(0, 10).map(async (file) => {
            const url = await uploadFile(file, "custom-designs");

            return prisma.customDesignRequestImage.create({
              data: {
                url,
                requestId: request.id,
              },
            });
          })
        );

        await Promise.all(uploadedImages);
      }
    }

    // 1️⃣ گرفتن همه admin و manager
    const adminsAndManagers = await prisma.user.findMany({
      where: {
        role: {
          is: {
            OR: [{ englishTitle: "admin" }, { englishTitle: "manager" }],
          },
        },
      },
      select: { id: true },
    });

    // 2️⃣ ارسال نوتیفیکیشن برای هر کاربر
    for (const user of adminsAndManagers) {
      const response = await createNnotification(
        "طرح جدید در سایت بارگذاری شد",
        user.id,
        `طرح جدید ${values?.name}`
      );
      useChat.getState().socket.emit("new-notification", { toUserId: user.id });
      if (!response.ok) {
        console.error(`خطا در ارسال نوتیفیکیشن برای کاربر ${user.id}`);
      } else {
        // میتونی اینجا اگر client-side هستی، صدا پخش کنی
        // sendMessageSound.play() یا هر فانکشن صدای خودت
      }
    }
    const adminsId = adminsAndManagers.map((item) => item.id);

    return NextResponse.json({
      success: true,
      requestId: request.id,
      adminsId,
    });
  } catch (error: any) {
    console.error("Error in custom design request:", error);
    return NextResponse.json(
      { success: false, error: error.message || "خطا در ثبت سفارش" },
      { status: 400 }
    );
  }
}
