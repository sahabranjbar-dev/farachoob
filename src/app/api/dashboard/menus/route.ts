import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // فیلترها
    const title = searchParams.get("title") || undefined;
    const href = searchParams.get("href") || undefined;
    const statusParam = searchParams.get("status");
    const status =
      statusParam === "true"
        ? true
        : statusParam === "false"
        ? false
        : undefined;

    // پجینیشن
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    // سورت
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const allowedSortFields = [
      "title",
      "href",
      "createdAt",
      "updateAt",
      "status",
    ];
    const validatedSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const filters = {
      AND: [
        title ? { title: { contains: title } } : {},
        href ? { href: { contains: href } } : {},
        typeof status === "boolean" ? { status } : {},
      ],
    };

    const totalItems = await prisma.menu.count({ where: filters });

    const menus = await prisma.menu.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [validatedSortBy]: sortOrder },
      include: { permission: true },
    });

    const menuData = menus.map((menu, index) => ({
      rowNumber: (page - 1) * pageSize + index + 1,
      id: menu.id,
      title: menu.title,
      href: menu.href,
      icon: menu.icon,
      status: menu.status,
      createdAt: menu.createdAt,
      updateAt: menu.updateAt,
      permission: menu.permission,
    }));

    return NextResponse.json({
      resultList: menuData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch (error) {
    console.error("GET /menus error:", error);
    return NextResponse.json(
      { message: "خطا در دریافت منوها" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, href, icon, permissionId, status } = await request.json();

    if (!title || !href || !permissionId) {
      return NextResponse.json(
        { message: "عنوان، آدرس و دسترسی الزامی است." },
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

// export async function DELETE(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const idParam = searchParams.get("id");
//     if (!idParam) {
//       return NextResponse.json(
//         { message: "شناسه منو لازم است." },
//         { status: 400 }
//       );
//     }
//     const id = parseInt(idParam, 10);

//     await prisma.menu.delete({
//       where: { id },
//     });

//     return NextResponse.json({ message: "منو با موفقیت حذف شد." });
//   } catch (error) {
//     return NextResponse.json({ message: "خطا در حذف منو" }, { status: 500 });
//   }
// }
