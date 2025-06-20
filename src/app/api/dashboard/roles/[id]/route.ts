import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { englishTitle, farsiTitle, description, status } =
      await request.json();

    if (!id || !englishTitle || typeof englishTitle !== "string") {
      return NextResponse.json(
        { message: "داده‌های ورودی نامعتبر است." },
        { status: 400 }
      );
    }

    const role = await prisma.role.update({
      where: { id },
      data: { englishTitle, farsiTitle, description, status },
    });

    return NextResponse.json(role);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطا در ویرایش نقش." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json(
        { message: "شناسه نقش معتبر نیست." },
        { status: 400 }
      );
    }

    await prisma.role.delete({ where: { id } });

    return NextResponse.json({ message: "نقش با موفقیت حذف شد." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در حذف نقش." }, { status: 500 });
  }
}
