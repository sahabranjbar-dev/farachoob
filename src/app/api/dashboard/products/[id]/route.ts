// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "شناسه محصول الزامی است." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updated = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ result: updated });
  } catch (error) {
    console.error("خطای ویرایش محصول:", error);
    return NextResponse.json(
      { error: "خطا در ویرایش محصول." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "شناسه محصول الزامی است." },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "محصول با موفقیت حذف شد." });
  } catch (error) {
    console.error("خطای حذف محصول:", error);
    return NextResponse.json({ error: "خطا در حذف محصول." }, { status: 500 });
  }
}
