import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { participantId } = body;

    if (!participantId) {
      return Response.json(
        { error: "participantId is required" },
        { status: 400 }
      );
    }

    // بررسی وجود کانورسیشن قبلی
    let conversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        participants: {
          some: { userId: userId },
        },
        AND: {
          participants: {
            some: { userId: participantId },
          },
        },
      },
      include: {
        participants: { select: { userId: true } },
        messages: {
          orderBy: {
            createdAt: "asc", // ✅ پیام‌های قدیمی اول، جدیدترین آخر
          },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          isGroup: false,
          participants: {
            create: [{ userId }, { userId: participantId }],
          },
        },
        include: {
          participants: { select: { userId: true } },
          messages: true,
        },
      });
    }

    return Response.json(conversation, { status: 200 });
  } catch (error) {
    console.error("POST /api/conversation error:", error);

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const baseConversationInclude = {
  participants: {
    select: {
      id: true,
      userId: true,
      lastReadAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          mobile: true,
          role: {
            select: {
              id: true,
              englishTitle: true,
              farsiTitle: true,
            },
          },
        },
      },
    },
  },
  messages: {
    select: {
      id: true,
      tempId: true,
      content: true,
      createdAt: true,
      senderId: true,
      read: true,
    },
  },
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // بررسی نقش کاربر
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: { select: { englishTitle: true } },
      },
    });

    if (
      !user ||
      !["admin", "manager"].includes(user.role.englishTitle ?? "admin")
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // گرفتن همه کانورسیشن‌هایی که کاربر جزو participants هست
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: baseConversationInclude,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
