import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId") as string;

    const { id, senderId } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Message id is required" },
        { status: 400 }
      );
    }
    const targetMessage = await prisma.message.findUnique({
      where: { id, NOT: { senderId } },
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
        message: `read the ${targetMessage.id}`,
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
