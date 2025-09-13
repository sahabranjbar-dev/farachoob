import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { participantId } = body;

    if (!participantId) {
      return Response.json(
        { error: "participantId is required" },
        { status: 400 }
      );
    }

    // بررسی وجود کانورسیشن قبلی
    let conversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        participants: {
          every: {
            userId: { in: [userId, participantId] },
          },
        },
      },
      include: {
        participants: { select: { userId: true } },
        messages: true,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          isGroup: false,
          participants: {
            create: [{ userId }, { userId: participantId }],
          },
        },
        include: {
          participants: { select: { userId: true } },
          messages: true,
        },
      });
    }

    return Response.json(conversation, { status: 200 });
  } catch (error) {
    console.error("POST /api/conversation error:", error);

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
