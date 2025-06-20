// /app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// گرفتن لیست کاربران
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const usersData = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }));

    return NextResponse.json(usersData);
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت کاربران." },
      { status: 500 }
    );
  }
}

// ساخت کاربر (اختیاری اگر بخوای اضافه کنی)
export async function POST(request: Request) {
  try {
    const { name, email, password, roles } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "اطلاعات ورودی ناقص است." },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // بهتره هش شده باشه
        roles: {
          create: roles.map((roleId: number) => ({
            role: { connect: { id: roleId } },
          })),
        },
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ساخت کاربر." },
      { status: 500 }
    );
  }
}

// ویرایش کاربر
export async function PUT(request: Request) {
  try {
    const { name, email, roleIds, id } = await request.json();

    if (!id || !name || !email || !Array.isArray(roleIds)) {
      return NextResponse.json(
        { message: "اطلاعات ورودی نامعتبر است." },
        { status: 400 }
      );
    }

    await prisma.userRole.deleteMany({ where: { userId: id } });

    const userRolesData = roleIds.map((roleId) => ({
      userId: id,
      roleId,
    }));

    await prisma.userRole.createMany({ data: userRolesData });

    await prisma.user.update({
      where: { id },
      data: { email, name },
    });

    return NextResponse.json({ message: "کاربر با موفقیت ویرایش شد" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطا در بروزرسانی کاربر." },
      { status: 500 }
    );
  }
}

// حذف کاربر
export async function DELETE(request: Request) {
  try {
    const id = Number(request.body);

    if (!id) {
      return NextResponse.json(
        { message: "شناسه معتبر نیست." },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "کاربر با موفقیت حذف شد." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در حذف کاربر." }, { status: 500 });
  }
}
