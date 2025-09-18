import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return Response.redirect("/auth/login");
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { participantId, isSecure } = body;

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
        participants: { some: { userId } },
        AND: { participants: { some: { userId: participantId } } },
      },
      include: {
        participants: { select: { userId: true } },
        messages: { orderBy: { createdAt: "asc" as const } },
      },
    });

    if (!conversation) {
      const participantsData = [{ userId: participantId }, { userId }];

      conversation = await prisma.conversation.create({
        data: {
          isGroup: false,
          participants: { create: participantsData },
        },
        include: {
          participants: { select: { userId: true } },
          messages: true,
        },
      });
    }

    return Response.json({ ...conversation, isSecure }, { status: 200 });
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
    orderBy: { createdAt: "desc" as const }, // حتما "desc" یا "asc" از نوع SortOrder باشه
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

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.redirect("/auth/login");
    }

    // بررسی نقش کاربر
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: { select: { englishTitle: true } } },
    });

    if (!user || !["admin", "manager"].includes(user.role.englishTitle ?? "")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req?.url);

    const isSecure = url.searchParams.get("isSecure") ?? "true";

    const parsedSecure = JSON.parse(isSecure);

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        ...baseConversationInclude,
        _count: {
          select: {
            messages: {
              where: {
                read: false,
                senderId: { not: userId }, // اگر میخوای فقط پیام‌های دیگران که نخوانده‌اند
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const mappedWithIsSecure = conversations.map((item) => ({
      ...item,
      isSecure: parsedSecure,
    }));
    return NextResponse.json(
      { conversations: mappedWithIsSecure },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /conversations error:", error);
    return NextResponse.json(
      { message: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
