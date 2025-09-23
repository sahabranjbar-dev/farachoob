import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const id = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          message: "id is required",
        },
        {
          status: 401,
        }
      );
    }

    const article = await prisma.article.findUnique({
      where: {
        id,
      },
    });

    if (!article) {
      return NextResponse.json({ message: "مقاله پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
