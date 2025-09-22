import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role?.englishTitle !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    // 📌 فیلترها
    const name = searchParams.get("name") || undefined;
    const mobile = searchParams.get("mobile") || undefined;
    const productType = searchParams.get("productType") || undefined;

    // 📌 پجینیشن
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    // 📌 سورت
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const allowedSortFields = [
      "name",
      "mobile",
      "productType",
      "createdAt",
      "updatedAt",
    ];
    const validatedSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    // 📌 ساخت فیلترهای Prisma
    const filters = {
      AND: [
        name ? { name: { contains: name } } : {},
        mobile ? { mobile: { contains: mobile } } : {},
        productType ? { productType: { contains: productType } } : {},
      ],
    };

    // 📌 شمارش کل
    const totalItems = await prisma.customDesignRequest.count({
      where: filters,
    });

    // 📌 گرفتن داده‌ها
    const requests = await prisma.customDesignRequest.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [validatedSortBy]: sortOrder },
    });

    // 📌 آماده‌سازی دیتا
    const requestsData = requests.map((req, index) => ({
      rowNumber: (page - 1) * pageSize + index + 1,
      id: req.id,
      name: req.name,
      mobile: req.mobile,
      productType: req.productType,
      dimensions: req.dimensions,
      material: req.material,
      color: req.color,
      description: req.description,
      createdAt: req.createdAt,
      updatedAt: req.updatedAt,
    }));

    return NextResponse.json({
      resultList: requestsData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch (error) {
    console.error("GET /custom-design error:", error);
    return NextResponse.json(
      { message: "خطا در دریافت سفارش‌ها" },
      { status: 500 }
    );
  }
}
