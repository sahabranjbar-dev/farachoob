import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const skip = (page - 1) * pageSize;

  const [projects, totalItems] = await Promise.all([
    prisma.project.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        images: true,
        active: true,
        createdAt: true,
      },
    }),
    prisma.project.count(),
  ]);

  return NextResponse.json({ projects, totalItems });
};
