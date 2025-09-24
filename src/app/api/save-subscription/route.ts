import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userSession = await getServerSession(authOptions);

    if (!userSession?.user.id) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`
      );
    }

    const body = await req.json();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    // بررسی اینکه endpoint در کل دیتابیس وجود دارد (برای هر کاربری)
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: {
        endpoint: body.endpoint,
      },
    });

    if (existingSubscription) {
      // اگر endpoint از قبل وجود دارد، آپدیتش کن (حتی اگر برای کاربر دیگری باشد)
      const updatedSubscription = await prisma.pushSubscription.update({
        where: {
          endpoint: body.endpoint,
        },
        data: {
          p256dh: body.keys.p256dh,
          auth: body.keys.auth,
          userId: userId, // مالکیت را به کاربر جدید تغییر بده
        },
      });

      return NextResponse.json({
        success: true,
        subscription: updatedSubscription,
        message: "Subscription updated for new user",
        action: "updated",
      });
    }

    // اگر endpoint وجود ندارد، ایجاد کن
    const subscription = await prisma.pushSubscription.create({
      data: {
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
      action: "created",
    });
  } catch (err: any) {
    console.error("Error saving subscription:", err);

    // هندل کردن خطای تکراری
    if (err.code === "P2002") {
      // اگر بازهم خطا داد، سعی کن آپدیت کنی
      try {
        const body = await req.json();
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

        const updatedSubscription = await prisma.pushSubscription.update({
          where: {
            endpoint: body.endpoint,
          },
          data: {
            p256dh: body.keys.p256dh,
            auth: body.keys.auth,
            userId: userId ?? "",
          },
        });

        return NextResponse.json({
          success: true,
          subscription: updatedSubscription,
          message: "Subscription updated after conflict",
          action: "updated_after_conflict",
        });
      } catch (updateError) {
        return NextResponse.json(
          { success: false, error: "Failed to handle duplicate subscription" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}
