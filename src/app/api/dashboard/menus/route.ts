import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const menus = await prisma.menu.findMany({
    where: { status: true },
    include: { permission: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(menus);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, href, icon, permissionId, status } = body;

    if (!title || !href || !permissionId) {
      return NextResponse.json(
        { message: "عنوان، آدرس و شناسه دسترسی الزامی است." },
        { status: 400 }
      );
    }

    const menu = await prisma.menu.create({
      data: {
        title,
        href,
        icon,
        permissionId,
        status: status ?? true,
      },
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در ایجاد منو" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, href, icon, permissionId, status } = body;

    if (!id || !title || !href || !permissionId) {
      return NextResponse.json(
        { message: "شناسه، عنوان، آدرس و شناسه دسترسی الزامی است." },
        { status: 400 }
      );
    }

    const menu = await prisma.menu.update({
      where: { id },
      data: {
        title,
        href,
        icon,
        permissionId,
        status,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در به‌روزرسانی منو" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json(
        { message: "شناسه منو لازم است." },
        { status: 400 }
      );
    }
    const id = parseInt(idParam, 10);

    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ message: "منو با موفقیت حذف شد." });
  } catch (error) {
    return NextResponse.json({ message: "خطا در حذف منو" }, { status: 500 });
  }
}
