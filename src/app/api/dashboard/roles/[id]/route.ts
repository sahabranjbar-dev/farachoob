import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Update role
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { farsiTitle, englishTitle, description, permissionIds, status } =
      body;

    if (!farsiTitle || !englishTitle) {
      return NextResponse.json(
        { message: "عنوان فارسی و انگلیسی الزامی است." },
        { status: 400 }
      );
    }

    // حذف پرمیشن‌های قبلی
    await prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    // بروزرسانی نقش
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        farsiTitle,
        englishTitle,
        description,
        status,
        permissions: {
          create: permissionIds.map((permissionId: string) => ({
            permission: { connect: { id: permissionId } },
          })),
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
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // حذف پرمیشن‌های متصل به نقش
    await prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    // حذف نقش
    await prisma.role.delete({
      where: { id },
    });

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
