import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // فیلترها
    const farsiTitle = searchParams.get("farsiTitle") || undefined;
    const englishTitle = searchParams.get("englishTitle") || undefined;
    // پجینیشن
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    // سورت
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const allowedSortFields = [
      "farsiTitle",
      "englishTitle",
      "createdAt",
      "updateAt",
    ];
    const validatedSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const filters = {
      AND: [
        farsiTitle ? { farsiTitle: { contains: farsiTitle } } : {},
        englishTitle ? { englishTitle: { contains: englishTitle } } : {},
      ],
    };

    const totalItems = await prisma?.category.count({ where: filters });

    const categories = await prisma?.category.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [validatedSortBy]: sortOrder },
    });

    const categoriesData = categories?.map((brand, index) => ({
      rowNumber: (page - 1) * pageSize + index + 1,
      id: brand.id,
      farsiTitle: brand.farsiTitle,
      englishTitle: brand.englishTitle,
      createdAt: brand.createdAt,
      updateAt: brand.updateAt,
    }));

    return NextResponse.json({
      resultList: categoriesData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil((totalItems ?? 0) / pageSize),
    });
  } catch (error) {
    console.error("GET /categories error:", error);
    return NextResponse.json(
      { message: "خطا در دریافت دسته‌بندی‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { farsiTitle, englishTitle } = await request.json();

    const category = await prisma?.category.create({
      data: {
        englishTitle,
        farsiTitle,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ایجاد دسته‌بندی" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { farsiTitle, englishTitle, id } = await request.json();

    const category = await prisma?.category.update({
      where: { id },
      data: {
        englishTitle,
        farsiTitle,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ویرایش دسته‌بندی" },
      { status: 500 }
    );
  }
}
