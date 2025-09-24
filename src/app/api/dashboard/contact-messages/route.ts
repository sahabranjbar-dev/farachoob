import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      session?.user.role?.englishTitle !== "admin" ||
      session?.user.role?.englishTitle !== "manager"
    ) {
      return NextResponse.json({ message: "UnAuthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    // فیلترها
    const name = searchParams.get("name") || undefined;
    const email = searchParams.get("email") || undefined;
    const mobile = searchParams.get("mobile") || undefined;
    // پجینیشن
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    // سورت
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const allowedSortFields = [
      "name",
      "email",
      "mobile",
      "createdAt",
      "updateAt",
    ];
    const validatedSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const filters = {
      AND: [
        email ? { email: { contains: email } } : {},
        name ? { name: { contains: name } } : {},
        mobile ? { mobile: { contains: mobile } } : {},
      ],
    };

    const totalItems = await prisma?.contactMessage.count({ where: filters });

    const contactMessages = await prisma?.contactMessage.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [validatedSortBy]: sortOrder },
    });

    const contactMessagesData = contactMessages?.map(
      (contactMessage, index) => ({
        rowNumber: (page - 1) * pageSize + index + 1,
        id: contactMessage.id,
        name: contactMessage.name,
        email: contactMessage.email,
        mobile: contactMessage.mobile,
        createdAt: contactMessage.createdAt,
      })
    );

    return NextResponse.json({
      resultList: contactMessagesData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil((totalItems ?? 0) / pageSize),
    });
  } catch (error) {
    console.error("GET /contact-messages error:", error);
    return NextResponse.json(
      { message: "خطا در دریافت پیام‌ها" },
      { status: 500 }
    );
  }
}
