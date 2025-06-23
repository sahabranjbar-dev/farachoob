import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // گرفتن لیست permissionId های کاربر
    const roleId = session?.user?.roleId;

    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    });

    const permissionIds = rolePermissions.map((rp) => rp.permissionId);

    const menus = await prisma.menu.findMany({
      where: {
        permissionId: { in: permissionIds },
        status: true,
      },
      select: {
        id: true,
        title: true,
        href: true,
        icon: true,
        permissionId: true,
      },
    });

    return NextResponse.json({
      resultList: menus,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطا در دریافت منوها." },
      { status: 500 }
    );
  }
}
