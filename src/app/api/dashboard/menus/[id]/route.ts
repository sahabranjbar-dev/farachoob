import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const menu = await prisma?.menu.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json(menu, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "مشکلی در دریافت منو پیش آمد." },
      { status: 500 }
    );
  }
}
