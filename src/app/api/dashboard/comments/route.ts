import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// تابع بازگشتی برای گرفتن تمام والدین
async function getParentHierarchy(parentId: string | null): Promise<any> {
  if (!parentId) return null;

  const parent = await prisma.comment.findUnique({
    where: { id: parentId },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      likes: { select: { id: true } },
      replies: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
  });

  if (!parent) return null;

  // بازگشت برای گرفتن والد والد
  const grandParent = await getParentHierarchy(parent.parentId);

  return {
    ...parent,
    parent: grandParent, // والد فعلی، والد خودش رو شامل میشه
  };
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "UnAuthorized" }, { status: 403 });
    }

    // گرفتن query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const articleId = searchParams.get("articleId");
    const projectId = searchParams.get("projectId");
    const userId = searchParams.get("userId");

    // محاسبه offset برای pagination
    const skip = (page - 1) * pageSize;

    // ساخت فیلتر دینامیک
    const where: any = {};
    if (articleId) where.articleId = articleId;
    if (projectId) where.projectId = projectId;
    if (userId) where.userId = userId;

    // گرفتن دیتا + شمارش کل
    const [comments, totalCount] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          likes: {
            select: {
              id: true,
              user: true,
            },
          },
          replies: true,
        },
      }),
      prisma.comment.count({ where }),
    ]);

    // اضافه کردن parent hierarchy به هر کامنت
    const commentsWithHierarchy = await Promise.all(
      comments.map(async (comment, index) => {
        let parentHierarchy = null;

        if (comment.parentId) {
          parentHierarchy = await getParentHierarchy(comment.parentId);
        }

        return {
          ...comment,
          parent: parentHierarchy,
          rowNumber: skip + index + 1,
        };
      })
    );

    return NextResponse.json({
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      resultList: commentsWithHierarchy,
    });
  } catch (error) {
    console.error("❌ Error in GET /comments:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
