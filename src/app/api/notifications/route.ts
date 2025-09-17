import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// تعریف schema با Zod
const notificationSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  message: z.string().min(1, "پیام الزامی است"),
  type: z
    .enum(["INFO", "SUCCESS", "WARNING", "ERROR", "MESSAGE", "ORDER"])
    .optional(),
  isRead: z.boolean().optional().default(false),
  readAt: z.string().datetime().optional(), // اگر تاریخ فرستاده شود
  createdAt: z.string().datetime().optional(), // اگر تاریخ فرستاده شود
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // ولیدیشن با Zod
    const parsed = notificationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const { title, message, type, isRead, readAt, createdAt } = parsed.data;

    // ذخیره در دیتابیس
    const newNotification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || "INFO",
        isRead,
        readAt: readAt ? new Date(readAt) : null,
        createdAt: createdAt ? new Date(createdAt) : undefined,
      },
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
