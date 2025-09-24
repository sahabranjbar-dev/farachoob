import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/uploadFile";

// آپدیت مقاله
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const articleId = formData.get("id") as string;
    if (!articleId)
      return NextResponse.json(
        { error: "شناسه مقاله الزامی است" },
        { status: 400 }
      );

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article)
      return NextResponse.json({ error: "مقاله پیدا نشد" }, { status: 404 });

    let coverImageUrl = article.coverImage;
    const newImage = formData.get("coverImage") as File | null;

    if (newImage && newImage.size > 0) {
      if (!newImage.type.startsWith("image/")) {
        return NextResponse.json({ error: "فایل معتبر نیست" }, { status: 400 });
      }
      coverImageUrl = await uploadFile(newImage, "blogs");
    }

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        coverImage: coverImageUrl,
        published: formData.get("published") === "true",
      },
    });

    return NextResponse.json({
      message: "مقاله با موفقیت بروزرسانی شد",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("PUT /articles error:", error);
    return NextResponse.json(
      { error: "خطا در بروزرسانی مقاله" },
      { status: 500 }
    );
  }
}
