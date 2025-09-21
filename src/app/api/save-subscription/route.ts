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

    // چک کردن اینکه همین endpoint برای همین کاربر وجود داره یا نه
    const subscriptionExist = await prisma.pushSubscription.findFirst({
      where: {
        userId,
        endpoint: body.endpoint,
      },
    });

    if (subscriptionExist) {
      return NextResponse.json({
        success: true,
        subscription: subscriptionExist,
        message: "Subscription already exists",
      });
    }

    const subscription = await prisma.pushSubscription.create({
      data: {
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        userId,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (err) {
    console.error("Error saving subscription:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}
