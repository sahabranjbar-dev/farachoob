import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const roleId = session?.user?.roleId;

    // گرفتن permissionId های کاربر
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    });
    const permissionIds = rolePermissions.map((rp) => rp.permissionId);

    // واکشی منوها با زیرمنوها
    const menus = await prisma.menu.findMany({
      where: {
        parentId: null, // فقط منوهای اصلی
        permissionId: { in: permissionIds },
        status: true,
      },
      include: {
        subMenus: {
          where: {
            permissionId: { in: permissionIds },
            status: true,
          },
        },
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({ resultList: menus });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطا در دریافت منوها." },
      { status: 500 }
    );
  }
}
