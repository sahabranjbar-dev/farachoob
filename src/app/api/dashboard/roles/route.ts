import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    const totalItems = await prisma.role.count({ where: filters });

    const roles = await prisma.role.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        farsiTitle: true,
        englishTitle: true,
        description: true,
        status: true,
        createdAt: true,
        updateAt: true,
        permissions: {
          select: {
            permission: true,
            permissionId: true,
          },
        },
        users: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    const rolesData = roles.map((role, index) => ({
      rowNumber: (page - 1) * pageSize + index + 1,
      id: role.id,
      farsiTitle: role.farsiTitle,
      englishTitle: role?.englishTitle,
      description: role.description,
      createdAt: role.createdAt,
      updateAt: role.updateAt,
      permissions: role.permissions,
      users: role.users,
      status: role.status,
    }));
    return NextResponse.json({
      resultList: rolesData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch {
    return NextResponse.json(
      { message: "خطا در دریافت نقش‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { farsiTitle, englishTitle, description, permissionIds } = body;

    if (!farsiTitle || !englishTitle) {
      return NextResponse.json(
        { message: "عنوان فارسی و انگلیسی الزامی است." },
        { status: 400 }
      );
    }

    const newRole = await prisma.role.create({
      data: {
        farsiTitle,
        englishTitle,
        description,
        status: true,
        permissions: {
          create: permissionIds.map((id: string) => ({
            permission: { connect: { id } },
          })),
        },
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "مشکلی در ایجاد نقش پیش آمد." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, farsiTitle, englishTitle, description, permissionIds, status } =
      body;

    if (!id)
      return NextResponse.json(
        { message: "شناسه نقش الزامی است." },
        { status: 400 }
      );
    if (!farsiTitle || !englishTitle) {
      return NextResponse.json(
        { message: "عنوان فارسی و انگلیسی الزامی است." },
        { status: 400 }
      );
    }

    // حذف پرمیشن‌های قبلی
    await prisma.rolePermission.deleteMany({ where: { roleId: id } });

    // بروزرسانی نقش
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        farsiTitle,
        englishTitle,
        description,
        status,
        permissions: {
          create:
            permissionIds?.map((permissionId: string) => ({
              permission: { connect: { id: permissionId } },
            })) || [],
        },
      },
    });

    return NextResponse.json(updatedRole, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "مشکلی در بروزرسانی نقش پیش آمد." },
      { status: 500 }
    );
  }
}

// Delete role
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id)
      return NextResponse.json(
        { message: "شناسه نقش الزامی است." },
        { status: 400 }
      );

    // حذف پرمیشن‌های متصل به نقش
    await prisma.rolePermission.deleteMany({ where: { roleId: id } });

    // حذف نقش
    await prisma.role.delete({ where: { id } });

    return NextResponse.json(
      { message: "نقش با موفقیت حذف شد." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "مشکلی در حذف نقش پیش آمد." },
      { status: 500 }
    );
  }
}
