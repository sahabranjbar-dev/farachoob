import { MENU_CONFIG } from "@/constants/MENU_CONFIG";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_SECRET = process.env.SEED_SECRET_KEY;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");

    if (secret !== ALLOWED_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const results: { menu: string; status: string; message?: string }[] = [];

    for (const [menuKey, menu] of Object.entries(MENU_CONFIG)) {
      try {
        // پیدا کردن permission مربوطه
        const permission = await prisma.permission.findUnique({
          where: { permissionKey: menu.permissions.view },
        });

        if (!permission) {
          results.push({
            menu: menu.title,
            status: "skipped",
            message: "Permission not found",
          });
          console.warn(`⚠️ Permission not found for menu: ${menu.title}`);
          continue;
        }

        await prisma.menu.upsert({
          where: { href: menu.href },
          update: {
            title: menu.title,
            icon: menu.icon,
            permissionId: permission.id,
          },
          create: {
            title: menu.title,
            href: menu.href,
            icon: menu.icon,
            permissionId: permission.id,
          },
        });

        results.push({ menu: menu.title, status: "created" });
        console.log(`✅ Menu processed: ${menu.title}`);
      } catch (menuError) {
        console.error(`❌ Error processing menu ${menu.title}:`, menuError);
        results.push({
          menu: menu.title,
          status: "error",
          message: (menuError as Error).message,
        });
      }
    }

    return NextResponse.json({
      message: "Menus seeded",
      results,
    });
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
