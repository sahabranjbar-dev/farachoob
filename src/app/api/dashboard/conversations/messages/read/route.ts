import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.redirect("/login");
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Message id is required" },
        { status: 400 }
      );
    }
    const targetMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!targetMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json(
      {
        message: `read the ${targetMessage.id}`,
        ok: true,
        updatedMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}
