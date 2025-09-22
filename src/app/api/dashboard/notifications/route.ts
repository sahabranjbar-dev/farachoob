import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendNotification } from "@/lib/sendNotification";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`);
  }

  const userId = session?.user.id;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: userId, // filter notifications by userId
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true, // include the related user data
    },
  });

  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const { title, message, type, userId } = await req.json();

  if (!title || !message) {
    return NextResponse.json(
      { error: "عنوان و پیام الزامی است" },
      { status: 400 }
    );
  }

  const notification = await prisma.notification.create({
    data: {
      title,
      message,
      type: type || "INFO",
      userId,
    },
  });

  const response = await sendNotification(message, userId);
  if (!response.ok)
    return NextResponse.json(
      {
        message: "خطایی رخ داده است، لطفا دوباره تلاش کنید",
      },
      {
        status: 402,
      }
    );

  return NextResponse.json(notification, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id)
    return NextResponse.json(
      { error: "شناسه اعلان الزامی است" },
      { status: 400 }
    );

  const { title, message, type, isRead } = await req.json();

  const updated = await prisma.notification.update({
    where: { id },
    data: { title, message, type, isRead, readAt: isRead ? new Date() : null },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id)
    return NextResponse.json(
      { error: "شناسه اعلان الزامی است" },
      { status: 400 }
    );

  await prisma.notification.delete({ where: { id } });
  return NextResponse.json({ message: "اعلان حذف شد" });
}
