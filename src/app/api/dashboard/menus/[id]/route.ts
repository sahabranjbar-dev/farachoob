import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET منو با id
export async function GET(request: NextRequest, context: any) {
  try {
    const id = context?.params?.id;

    if (!id) {
      return NextResponse.json(
        { message: "شناسه منو مشخص نشده" },
        { status: 400 }
      );
    }

    const menu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      return NextResponse.json({ message: "منو پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "مشکلی در دریافت منو پیش آمد." },
      { status: 500 }
    );
  }
}

// DELETE منو با id
export async function DELETE(request: NextRequest, context: any) {
  try {
    const id = context?.params?.id;

    if (!id) {
      return NextResponse.json(
        { message: "شناسه منو مشخص نشده" },
        { status: 400 }
      );
    }

    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ message: "منو با موفقیت حذف شد" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "مشکلی در حذف منو پیش آمد." },
      { status: 500 }
    );
  }
}
