import { NextResponse } from "next/server";

export async function DELETE(request: Request, context: any) {
  try {
    const id = await context?.params?.id;

    const brand = await prisma?.brand.delete({
      where: { id },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در حذف برند" }, { status: 500 });
  }
}
