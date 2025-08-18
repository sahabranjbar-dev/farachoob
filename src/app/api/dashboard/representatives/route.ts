import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // فیلترها
    const firstName = searchParams.get("firstName") || undefined;
    const city = searchParams.get("city") || undefined;
    const mobile = searchParams.get("mobile") || undefined;

    // Pagination
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    // Sort
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const allowedSortFields = ["firstName", "city", "province", "createdAt"];
    const validatedSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    // فیلتر کردن داده‌ها
    const filters: any = {
      AND: [
        firstName ? { firstName: { contains: firstName } } : {},
        city ? { city: { contains: city } } : {},
        mobile ? { mobile: { contains: mobile } } : {},
      ],
    };

    const totalItems = await prisma.representative.count({ where: filters });

    const reps = await prisma.representative.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [validatedSortBy]: sortOrder },
    });

    const repData = reps.map((rep, index) => ({
      rowNumber: (page - 1) * pageSize + index + 1,
      id: rep.id,
      firstName: rep.firstName,
      lastName: rep.lastName,
      mobile: rep.mobile,
      address: rep.address,
      city: rep.city,
      province: rep.province,
      latitude: rep.latitude,
      longitude: rep.longitude,
      createdAt: rep.createdAt,
      updatedAt: rep.updatedAt,
    }));

    return NextResponse.json({
      resultList: repData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch (error) {
    console.error("GET /representatives error:", error);
    return NextResponse.json(
      { message: "خطا در دریافت نمایندگان" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      firstName,
      lastName,
      mobile,
      address,
      city,
      province,
      latitude,
      longitude,
    } = await request.json();

    if (!firstName || !lastName || !mobile) {
      return NextResponse.json(
        { message: "نام، نام خانوادگی و شماره تماس الزامی است." },
        { status: 400 }
      );
    }

    const rep = await prisma.representative.create({
      data: {
        firstName,
        lastName,
        mobile,
        address,
        city,
        province,
        latitude: +longitude,
        longitude: +latitude,
      },
    });

    return NextResponse.json(rep, { status: 201 });
  } catch (error) {
    console.error("POST /representatives error:", error);
    return NextResponse.json(
      { message: "خطا در ایجاد نماینده" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      firstName,
      lastName,
      mobile,
      address,
      city,
      province,
      latitude,
      longitude,
    } = body;

    if (!id || !firstName || !lastName || !mobile) {
      return NextResponse.json(
        { message: "شناسه، نام، نام خانوادگی و شماره تماس الزامی است." },
        { status: 400 }
      );
    }

    const rep = await prisma.representative.update({
      where: { id },
      data: {
        firstName,
        lastName,
        mobile,
        address,
        city,
        province,
        latitude,
        longitude,
      },
    });

    return NextResponse.json(rep);
  } catch (error) {
    console.error("PUT /representatives error:", error);
    return NextResponse.json(
      { message: "خطا در به‌روزرسانی نماینده" },
      { status: 500 }
    );
  }
}
