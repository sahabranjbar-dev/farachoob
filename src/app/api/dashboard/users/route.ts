// /app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- Backend: Updated API with Filtering ---

// /api/dashboard/users/route.ts

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // فیلترها
    const name = searchParams.get("name") || undefined;
    const email = searchParams.get("email") || undefined;
    const role = searchParams.get("role") || undefined;
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    // پجینیشن
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    // سورت
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    // فیلترها
    const filters = {
      AND: [
        name ? { name: { contains: name } } : {},
        email ? { email: { contains: email } } : {},
        role ? { roles: { some: { id: Number(role) } } } : {},
        from ? { createdAt: { gte: new Date(from) } } : {},
        to ? { createdAt: { lte: new Date(to) } } : {},
      ],
    };

    // گرفتن تعداد کل
    const totalItems = await prisma.user.count({ where: filters });

    // گرفتن دیتا با پجینیشن و سورت
    const users = await prisma.user.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        roles: { select: { id: true, role: true } },
      },
    });

    // مپ کردن دیتا با شماره ردیف
    const usersData = users.map((user, index) => ({
      rowNumber: (page - 1) * pageSize + index + 1,
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      roles: user.roles.map((role) => role.role),
    }));

    return NextResponse.json({
      resultList: usersData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    });
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
