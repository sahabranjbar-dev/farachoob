// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getCommentsRecursive } from "@/lib/getCommentsRecursive";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get("articleId");

  if (!articleId) {
    return NextResponse.json(
      { error: "شناسه مقاله الزامی است" },
      { status: 400 }
    );
  }

  const comments = await getCommentsRecursive(null, articleId);

  return NextResponse.json({ comments });
}

// 1️⃣ اسکیمای ولیدیشن Zod
const createCommentSchema = z.object({
  articleId: z.string({
    required_error: "شناسه مقاله الزامی است",
  }),
  content: z
    .string({
      required_error: "متن کامنت الزامی است",
    })
    .min(1, "متن کامنت نمی‌تواند خالی باشد"),
  userId: z.string({
    required_error: "شناسه کاربر الزامی است",
  }),
  captcha: z.string({
    required_error: "کپچا الزامی است",
  }),
  commentParentId: z.string().optional(),
});

const updateCommentSchema = z.object({
  commentId: z.string({
    required_error: "شناسه کامنت الزامی است",
  }),
  content: z
    .string({
      required_error: "متن کامنت الزامی است",
    })
    .min(1, "متن کامنت نمی‌تواند خالی باشد"),
  userId: z.string({
    required_error: "شناسه کاربر الزامی است",
  }),
  captcha: z.string({
    required_error: "کپچا الزامی است",
  }),
});

// 2️⃣ ایجاد کامنت
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createCommentSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message;
      return NextResponse.json({ error: firstError }, { status: 422 });
    }

    const {
      articleId,
      content,
      userId,
      captcha: inputCaptcha,
      commentParentId,
    } = parsed.data;

    // بررسی کپچا
    const storedCaptcha = request.cookies.get("captcha")?.value;
    if (
      !storedCaptcha ||
      storedCaptcha.toLowerCase() !== inputCaptcha.toLowerCase()
    ) {
      return NextResponse.json({ error: "کپچا اشتباه است" }, { status: 422 });
    }

    // ساخت کامنت
    const newComment = await prisma.comment.create({
      data: {
        articleId,
        content,
        userId,
        parentId: commentParentId,
      },
      include: {
        user: { select: { id: true, email: true } },
      },
    });

    return NextResponse.json(
      {
        status: 200,
        message: "کامنت با موفقیت ثبت شد",
        comment: newComment,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error creating comment:", error);
    return NextResponse.json(
      { error: "خطای سرور رخ داده است", details: error.message },
      { status: 500 }
    );
  }
}

// 3️⃣ ویرایش کامنت
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateCommentSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message;
      return NextResponse.json({ error: firstError }, { status: 422 });
    }

    const { commentId, content, userId, captcha: inputCaptcha } = parsed.data;

    // بررسی کپچا
    const storedCaptcha = request.cookies.get("captcha")?.value;
    if (
      !storedCaptcha ||
      storedCaptcha.toLowerCase() !== inputCaptcha.toLowerCase()
    ) {
      return NextResponse.json({ error: "کپچا اشتباه است" }, { status: 422 });
    }

    // بررسی اینکه کامنت وجود داشته باشه و صاحبش همون یوزر باشه
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!existingComment) {
      return NextResponse.json({ error: "کامنت یافت نشد" }, { status: 404 });
    }
    if (existingComment.userId !== userId) {
      return NextResponse.json(
        { error: "شما مجاز به ویرایش این کامنت نیستید" },
        { status: 403 }
      );
    }

    // ویرایش کامنت
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: { select: { id: true, email: true } },
      },
    });

    return NextResponse.json(
      {
        status: 200,
        message: "کامنت با موفقیت ویرایش شد",
        comment: updatedComment,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error updating comment:", error);
    return NextResponse.json(
      { error: "خطای سرور رخ داده است", details: error.message },
      { status: 500 }
    );
  }
}
