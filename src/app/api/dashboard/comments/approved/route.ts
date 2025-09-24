import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role?.englishTitle !== "admin") {
      return NextResponse.json(
        { message: "دسترسی تایید کامنت را ندارید" },
        { status: 403 }
      );
    }

    const { commentId, isApproved } = await request.json();

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        isApproved,
      },
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
