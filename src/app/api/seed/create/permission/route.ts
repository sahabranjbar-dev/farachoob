// /app/api/seed-permissions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PermissionKey } from "@/constants/MENU_CONFIG";

const ALLOWED_SECRET = process.env.SEED_SECRET_KEY;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");

    if (secret !== ALLOWED_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // گرفتن تمام PermissionKey ها از enum
    const allPermissions = Object.values(PermissionKey);

    const results: { key: string; status: string; id?: string }[] = [];

    for (const key of allPermissions) {
      try {
        const permission = await prisma.permission.upsert({
          where: { permissionKey: key },
          update: {},
          create: { permissionKey: key, title: key }, // عنوان می‌تونه همون کلید باشه
        });

        results.push({ key, status: "created_or_existing", id: permission.id });
        console.log(`✅ Permission seeded: ${key}`);
      } catch (err) {
        console.error(`❌ Failed to create permission: ${key}`, err);
        results.push({ key, status: "error" });
      }
    }

    return NextResponse.json({ message: "Permissions seeded", results });
  } catch (err) {
    console.error("❌ Seed process failed", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
