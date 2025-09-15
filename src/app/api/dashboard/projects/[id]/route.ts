import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    console.log({ request });

    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "دسترسی ندارید" }, { status: 403 });

    const { id } = await context.params;

    const deletProject = await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(deletProject, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطایی در سرور رخ داده است", error },
      { status: 500 }
    );
  }
};
