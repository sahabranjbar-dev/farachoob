// /app/api/seed-manager-permissions/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ALLOWED_SECRET = process.env.SEED_SECRET_KEY;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");

    if (secret !== ALLOWED_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const managerRole = await prisma.role.findUnique({
      where: { englishTitle: "manager" },
    });

    if (!managerRole) {
      return NextResponse.json(
        { message: "Role 'Manager' not found" },
        { status: 404 }
      );
    }

    const allPermissions = await prisma.permission.findMany();

    await prisma.rolePermission.createMany({
      data: allPermissions.map((p) => ({
        roleId: managerRole.id,
        permissionId: p.id,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: "All permissions assigned to Manager successfully",
      role: managerRole,
    });
  } catch (err) {
    console.error("❌ Failed to assign permissions to Manager", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
