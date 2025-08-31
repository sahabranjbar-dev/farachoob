import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // اینجا هم باید Promise بذاری
) {
  try {
    const { id } = await context.params;

    const rolePerm = await prisma.rolePermission.findFirst({
      where: {
        permissionId: id,
      },
    });

    const roles = await prisma.role.findFirst({
      where: {
        id: rolePerm?.roleId,
      },
    });

    if (rolePerm)
      return NextResponse.json(
        {
          message: `به دلیل استفاده از این مجوز در نقش ${roles?.farsiTitle} ، امکان حذف آن وجود ندارد`,
        },
        { status: 500 }
      );
    return NextResponse.json({ message: "دسترسی با موفقیت حذف شد" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در حذف دسترسی" }, { status: 500 });
  }
}
