import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // فیلترها
    const name = searchParams.get("name") || undefined;
    const description = searchParams.get("description") || undefined;

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
        description ? { description: { contains: description } } : {},
      ],
    };

    // گرفتن تعداد کل
    const totalItems = await prisma.permission.count({ where: filters });

    const permissions = await prisma.permission.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updateAt: true,
        roles: { select: { role: true, roleId: true } },
      },
    });

    const permissionData = permissions.map((permission, index) => ({
      rowNumber: (page - 1) * pageSize + index + 1,
      id: permission.id,
      englishTitle: permission.name,
      farsiTitle: permission.description,
      createdAt: permission.createdAt,
      updateAt: permission.updateAt,
      roles: permission.roles,
    }));
    return NextResponse.json({
      resultList: permissionData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    });
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

// export async function DELETE(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const idParam = searchParams.get("id");
//     if (!idParam) {
//       return NextResponse.json(
//         { message: "شناسه دسترسی لازم است" },
//         { status: 400 }
//       );
//     }
//     const id = parseInt(idParam, 10);

//     await prisma.permission.delete({
//       where: { id },
//     });

//     return NextResponse.json({ message: "دسترسی با موفقیت حذف شد" });
//   } catch (error) {
//     return NextResponse.json({ message: "خطا در حذف دسترسی" }, { status: 500 });
//   }
// }
