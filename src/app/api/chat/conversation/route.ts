import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { normalizePhoneNumber } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
    // پیدا کردن کاربر
    let user = userId
      ? await prisma.user.findUnique({ where: { id: userId } })
      : await prisma.user.findUnique({ where: { mobile: normalizedMobile } });

    // پیدا کردن ادمین
    const admin = await prisma.user.findFirst({
      where: { role: { englishTitle: "manager" } },
    });
    if (!admin) {
      return NextResponse.json({ message: "ادمین پیدا نشد" }, { status: 500 });
    }

    let conversation;

    if (user) {
      // کاربر وجود داره
      conversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId: user.id } } },
            { participants: { some: { userId: admin.id } } },
          ],
        },
        include: {
          ...baseConversationInclude,
          ...(session ? { messages: true } : {}), // فقط اگر لاگین کرده بود پیام‌ها بیاد
        },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            participants: {
              create: [{ userId: user.id }, { userId: admin.id }],
            },
          },
          include: {
            ...baseConversationInclude,
            ...(session ? { messages: true } : {}),
          },
        });
      }
    } else {
      // کاربر جدید (مهمان)
      user = await prisma.user.create({
        data: {
          firstName: fullName,
          mobile: normalizedMobile,
          role: { connect: { englishTitle: "customer" } },
        },
      });

      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: user.id }, { userId: admin.id }],
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
