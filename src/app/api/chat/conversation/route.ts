import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { normalizePhoneNumber } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // گرفتن نقش کاربر
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdminOrManager = ["admin", "manager"].includes(
      currentUser.role?.englishTitle ?? "customer"
    );

    // گرفتن کانورسیشن‌ها
    let conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: { include: { user: { include: { role: true } } } },
        ...(isAdminOrManager && {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 20, // فقط آخرین ۲۰ پیام بیاد
          },
        }),
        _count: {
          select: {
            messages: {
              where: { read: false }, // پیام‌های خوانده نشده
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // فیلتر برای کاربر عادی
    if (!isAdminOrManager) {
      conversations = conversations.filter((conv) =>
        conv.participants.some(
          (p) =>
            p.userId !== userId &&
            ["admin", "manager"].includes(p.user.role?.englishTitle ?? "")
        )
      );
    }

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Conversations API error:", error);
    return NextResponse.json(
      { error: "Failed to load conversations" },
      { status: 500 }
    );
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
};
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    const body = await request.json();
    const { fullName, phone } = body;

    const normalizedMobile = phone ? normalizePhoneNumber(phone) : "";

    // پیدا کردن کاربر (یا با session، یا با موبایل)
    let user = userId
      ? await prisma.user.findUnique({ where: { id: userId } })
      : await prisma.user.findUnique({ where: { mobile: normalizedMobile } });

    // گرفتن همه‌ی ادمین‌ها و مدیرها
    const adminsAndManagers = await prisma.user.findMany({
      where: {
        role: {
          is: {
            englishTitle: { in: ["admin", "manager"] },
          },
        },
      },
      select: { id: true },
    });

    if (!adminsAndManagers.length) {
      return NextResponse.json(
        { message: "ادمین یا مدیر یافت نشد. لطفاً با تیم فنی تماس بگیرید." },
        { status: 500 }
      );
    }

    // آرایه‌ی همه participants (کاربر + admin/manager)
    const participantIds = user
      ? [user.id, ...adminsAndManagers.map((a) => a.id)]
      : [...adminsAndManagers.map((a) => a.id)]; // کاربر هنوز ایجاد نشده

    // بررسی کانورسیشن موجود با همین participants
    let conversation = user
      ? await prisma.conversation.findFirst({
          where: {
            AND: participantIds.map((id) => ({
              participants: { some: { userId: id } },
            })),
          },
          include: {
            ...baseConversationInclude,
            ...(session ? { messages: true } : {}),
          },
        })
      : null;

    // اگر کاربر وجود ندارد → ایجاد کاربر جدید
    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName: fullName,
          mobile: normalizedMobile,
          role: { connect: { englishTitle: "customer" } },
        },
      });
      participantIds.unshift(user.id); // اضافه کردن کاربر جدید به آرایه
    }

    // اگر کانورسیشن پیدا نشد → بساز
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: participantIds.map((id) => ({ userId: id })),
          },
        },
        include: {
          ...baseConversationInclude,
          ...(session ? { messages: true } : {}),
        },
      });
    }

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
