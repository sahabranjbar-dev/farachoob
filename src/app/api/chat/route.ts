import prisma from "@/lib/prisma";
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
}

export async function POST(request: NextRequest) {
  try {
    const { content, conversationId, senderId }: POSTBody =
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
      },
      include: {
        sender: {
          select: { id: true, email: true, image: true },
        },
      },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "خطای سمت سرور" }, { status: 500 });
  }
}
