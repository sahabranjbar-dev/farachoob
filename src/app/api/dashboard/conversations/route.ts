import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`
      );
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
          creatorId: userId,
        },
        include: {
          participants: { select: { userId: true } },
          messages: true,
        },
      });

      const notification = await prisma.notification.create({
        data: {
          message: "چت جدید ایجاد شد",
          title: "چت جدید از طرف کاربر ایجاد شد",
          type: "INFO",
          userId: participantId,
        },
      });
    }

    return Response.json(
      { ...conversation, isSecure, userId },
      { status: 200 }
    );
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
          image: true,
          lastName: true,
          email: true,
          biography: true,
          isActive: true,
          isVerified: true,
          searchVisible: true,
          profileVisible: true,
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
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`
      );
    }

    const url = new URL(req?.url);

    const isSecure = url.searchParams.get("isSecure") ?? "true";
    const conversationId =
      url?.searchParams?.get("conversationId") || undefined;
    const parsedSecure = JSON.parse(isSecure);
    // بررسی نقش کاربر
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: { select: { englishTitle: true } } },
    });

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
      },
    });

    if (
      !conversation?.id &&
      !["admin", "manager"].includes(user?.role.englishTitle ?? "")
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

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
                senderId: { not: userId },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const sorted = conversations.sort(
      (a, b) =>
        new Date(b.messages[0]?.createdAt || 0).getTime() -
        new Date(a.messages[0]?.createdAt || 0).getTime()
    );

    const mappedWithIsSecure = sorted.map((item) => ({
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
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`
      );
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "شناسه چت الزامی است" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "چت مورد نظر پیدا نشد" },
        { status: 404 }
      );
    }

    // چک می‌کنیم که فقط سازنده اجازه حذف داشته باشه
    if (
      conversation.creatorId !== userId &&
      session.user.role?.englishTitle !== "admin"
    ) {
      return NextResponse.json(
        { message: "شما اجازه حذف این چت را ندارید" },
        { status: 403 }
      );
    }

    const conversationId = conversation?.id;

    await prisma.$transaction(async (tx) => {
      await tx.message.deleteMany({ where: { conversationId } });
      await tx.conversation.delete({ where: { id: conversationId } });
    });

    return NextResponse.json({
      message: "چت با موفقیت حذف شد",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطایی رخ داده است" }, { status: 500 });
  }
}
