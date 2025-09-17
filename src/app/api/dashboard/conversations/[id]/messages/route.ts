import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// گرفتن همه پیام‌های یک conversation
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;

  const conversationId = resolvedParams.id;

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.redirect("/auth/login");
  }

  const { id: conversationId } = await params;
  const { content } = await req.json();

  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { error: "Message content is required" },
      { status: 400 }
    );
  }

  try {
    // بررسی اینکه کانورسیشن وجود دارد
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: { select: { userId: true } } },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // ایجاد پیام جدید
    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: session.user.id,
      },
      include: {
        sender: {
          select: { id: true, email: true, image: true },
        },
      },
    });

    // آرایه گیرنده‌ها (به جز sender)
    const recipients = conversation.participants
      .map((p) => p.userId)
      .filter((id) => id !== session.user.id);

    console.log({ recipients });

    // برگرداندن پیام + recipients برای socket
    return NextResponse.json({ ...message, recipients }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.redirect("/login");
    }
    const resolvedParams = await params;

    const conversationId = resolvedParams.id;
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Message id is required" },
        { status: 400 }
      );
    }
    const targetMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!targetMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await prisma.$transaction([
      // 1. پیام فعلی
      prisma.message.update({
        where: { id },
        data: { read: true },
      }),
      // 2. پیام‌های قبلی
      prisma.message.updateMany({
        where: {
          conversationId,
          createdAt: { lt: targetMessage.createdAt },
          read: false,
        },
        data: { read: true },
      }),
    ]);

    return NextResponse.json(
      {
        message: "ویرایش با موفقیت انجام شد",
        ok: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}
