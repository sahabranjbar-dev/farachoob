import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const categories = await prisma?.category.findMany();

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "مشکلی در دریافت دسته‌بندی‌ها رخ داد",
      },
      { status: 500 }
    );
  }
}
