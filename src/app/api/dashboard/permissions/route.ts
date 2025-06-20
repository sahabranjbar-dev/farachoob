import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(permissions);
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت دسترسی‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { message: "نام دسترسی الزامی است" },
        { status: 400 }
      );
    }

    // چک کردن تکراری نبودن نام
    const exists = await prisma.permission.findUnique({
      where: { name },
    });
    if (exists) {
      return NextResponse.json(
        { message: "این دسترسی قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    const permission = await prisma.permission.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(permission, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ایجاد دسترسی" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description } = body;

    if (!id || !name) {
      return NextResponse.json(
        { message: "شناسه و نام دسترسی الزامی است" },
        { status: 400 }
      );
    }

    // چک تکراری نبودن نام به جز خود رکورد
    const exists = await prisma.permission.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });
    if (exists) {
      return NextResponse.json(
        { message: "این نام دسترسی قبلاً استفاده شده است" },
        { status: 400 }
      );
    }

    const permission = await prisma.permission.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(permission);
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در به‌روزرسانی دسترسی" },
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
        { message: "شناسه دسترسی لازم است" },
        { status: 400 }
      );
    }
    const id = parseInt(idParam, 10);

    await prisma.permission.delete({
      where: { id },
    });

    return NextResponse.json({ message: "دسترسی با موفقیت حذف شد" });
  } catch (error) {
    return NextResponse.json({ message: "خطا در حذف دسترسی" }, { status: 500 });
  }
}
