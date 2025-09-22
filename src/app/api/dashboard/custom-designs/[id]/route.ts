import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(params: any, context: any) {
  try {
    const id = await context?.params?.id;

    const customDesign = await prisma.customDesignRequest.deleteMany({
      where: {
        id,
      },
    });
    return NextResponse.json(customDesign, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در حذف برند" }, { status: 500 });
  }
}
