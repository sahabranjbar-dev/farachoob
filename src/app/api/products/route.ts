// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const brand = searchParams.get("brand") || undefined;
    const category = searchParams.get("category") || undefined;
    const sort = searchParams.get("sort") || "latest";
    const inStock = searchParams.get("inStock") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: "صفحه نامعتبر است." }, { status: 400 });
    }

    const where: any = {};
    if (brand) where.brand = brand;
    if (category) where.category = category;
    if (inStock) where.stock = { gt: 0 };

    let orderBy: any;
    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "latest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        return NextResponse.json(
          { error: "پارامتر مرتب‌سازی نامعتبر است." },
          { status: 400 }
        );
    }

    const [menuData, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        select: {
          englishTitle: true,
          farsiTitle: true,
          id: true,
          image: true,
          price: true,
          description: true,
          stock: true,
          brand: true,
          category: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      resultList: menuData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch (error) {
    console.error("خطای سرور:", error);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد." },
      { status: 500 }
    );
  }
}
