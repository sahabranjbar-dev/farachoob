import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { commentId, userId } = await request.json();

    if (!commentId || !userId) {
      return NextResponse.json(
        { error: "شناسه کامنت و کاربر الزامی است" },
        { status: 400 }
      );
    }

    // بررسی اینکه کاربر قبلاً لایک زده یا نه
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    });

    if (existingLike) {
      // حذف لایک
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({
        status: 200,
        message: "لایک حذف شد",
        liked: false,
      });
    } else {
      // اضافه کردن لایک
      const newLike = await prisma.commentLike.create({
        data: {
          commentId,
          userId,
        },
      });

      return NextResponse.json({
        status: 200,
        message: "لایک ثبت شد",
        liked: true,
        like: newLike,
      });
    }
  } catch (error: any) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "خطای سرور رخ داد", details: error.message },
      { status: 500 }
    );
  }
}

// Optional: GET لایک‌ها برای یک کامنت
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    if (!commentId) {
      return NextResponse.json(
        { error: "شناسه کامنت الزامی است" },
        { status: 400 }
      );
    }

    const likes = await prisma.commentLike.findMany({
      where: { commentId },
      include: { user: true },
    });

    return NextResponse.json({ likes, count: likes.length });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "خطای سرور رخ داد" }, { status: 500 });
  }
}
