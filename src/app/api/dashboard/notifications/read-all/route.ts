import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          message: "UnAuthorized",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const userId = body?.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 401 }
      );
    }

    const updateNotificationCound = await prisma.notification.updateMany({
      data: {
        isRead: true,
      },
      where: {
        userId,
        isRead: false,
      },
    });

    return NextResponse.json(updateNotificationCound, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
