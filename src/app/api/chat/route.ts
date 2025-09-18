import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  try {
  } catch (error) {}
}

interface POSTBody {
  content: string;
  conversationId: string;
  senderId: string;
  tempId: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { content, conversationId, senderId, tempId }: POSTBody =
      await request.json();

    if (!content) {
      return NextResponse.json({
        message: "متن پیام نمیتواند خالی باشد",
        reason: "content",
      });
    }
    if (!conversationId || !senderId) {
      return NextResponse.json({
        message: "خطایی رخ داده است",
        reason: ["conversationId", "senderId"],
      });
    }

    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId,
        tempId,
      },
      include: {
        sender: {
          select: { id: true, email: true, image: true },
        },
      },
    });
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: { select: { userId: true } } },
    });

    const recipients = conversation?.participants
      .map((p) => p.userId)
      .filter((id) => id !== session?.user.id);

    return NextResponse.json({ ...message, recipients }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "خطای سمت سرور" }, { status: 500 });
  }
}
