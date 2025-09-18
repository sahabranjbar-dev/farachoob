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

    const role = currentUser.role?.englishTitle ?? "customer";

    let conversations;

    if (role === "manager") {
      // ✅ مدیر همه کانورسیشن‌ها رو می‌بینه
      conversations = await prisma.conversation.findMany({
        include: {
          participants: { include: { user: { include: { role: true } } } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 20, // فقط آخرین ۲۰ پیام
          },
          _count: {
            select: {
              messages: {
                where: { read: false }, // تعداد پیام‌های خوانده‌نشده
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    } else if (role === "admin") {
      // ✅ ادمین فقط کانورسیشن‌هایی که خودش پارتیسیپنت هست
      conversations = await prisma.conversation.findMany({
        where: {
          participants: { some: { userId } },
        },
        include: {
          participants: { include: { user: { include: { role: true } } } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 20,
          },
          _count: {
            select: {
              messages: {
                where: { read: false },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    } else {
      // ✅ کاربر عادی (مثلا customer) فقط چت‌هایی که با admin/manager داره
      conversations = await prisma.conversation.findMany({
        where: {
          participants: { some: { userId } },
        },
        include: {
          participants: { include: { user: { include: { role: true } } } },
          _count: {
            select: {
              messages: {
                where: { read: false },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      // فیلتر: فقط کانورسیشن‌هایی که طرف مقابل admin یا manager هست
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
const baseConversationInclude = (withMessages: boolean) => ({
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
  ...(withMessages ? { messages: true } : {}),
});

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

    // گرفتن یک ادمین
    const admin = await prisma.user.findFirst({
      where: { role: { is: { englishTitle: "admin" } } },
      select: { id: true },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "  لطفاً با تیم فنی تماس بگیرید." },
        { status: 500 }
      );
    }

    const participantIds = user ? [user.id, admin.id] : [admin.id];

    // فقط وقتی کاربر سشن داره پیام‌ها رو include کن
    const withMessages = !!userId;

    let conversation = user
      ? await prisma.conversation.findFirst({
          where: {
            AND: participantIds.map((id) => ({
              participants: { some: { userId: id } },
            })),
          },
          include: baseConversationInclude(withMessages),
        })
      : null;

    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName: fullName,
          mobile: normalizedMobile,
          role: { connect: { englishTitle: "customer" } },
        },
      });
      participantIds.unshift(user.id);
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: participantIds.map((id) => ({ userId: id })),
          },
        },
        include: baseConversationInclude(withMessages),
      });
    }

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/conversation error:", error);
    return NextResponse.json(
      { message: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
