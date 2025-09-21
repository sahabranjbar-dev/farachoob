import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const name = body?.name?.trim();

    if (!name) {
      return NextResponse.json(
        { message: "name is required" },
        { status: 400 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        searchVisible: true,
        OR: [
          { firstName: { contains: name, mode: "insensitive" } },
          { lastName: { contains: name, mode: "insensitive" } },
        ],
        NOT: [{ id: session.user.id }],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        mobile: true,
        image: true,
        role: {
          select: {
            farsiTitle: true,
            id: true,
            englishTitle: true,
          },
        },
        // هر چیزی که می‌خوای برگرده
      },
    });

    if (!users || users.length === 0) {
      return NextResponse.json(
        { message: "هیچ کاربری یافت نشد" },
        { status: 200 }
      );
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطا در دریافت کاربران." },
      { status: 500 }
    );
  }
}
