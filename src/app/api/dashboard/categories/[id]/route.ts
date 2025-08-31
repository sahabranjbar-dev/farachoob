import { NextResponse } from "next/server";

export async function DELETE(request: Request, context: any) {
  try {
    const id = await context?.params?.id;

    const category = await prisma?.category.delete({
      where: { id },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در حذف برند" }, { status: 500 });
  }
}
