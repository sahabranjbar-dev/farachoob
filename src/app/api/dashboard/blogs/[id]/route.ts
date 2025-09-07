import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; // فرض بر اینه که کانفیگ cloudinary داری
import { authOptions } from "@/lib/auth";

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
      const buffer = Buffer.from(await newImage.arrayBuffer());
      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "articles" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });
      coverImageUrl = (uploadRes as any).secure_url;
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

// حذف مقاله
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("id");
    if (!articleId)
      return NextResponse.json(
        { error: "شناسه مقاله الزامی است" },
        { status: 400 }
      );

    await prisma.article.delete({ where: { id: articleId } });

    return NextResponse.json({ message: "مقاله با موفقیت حذف شد" });
  } catch (error) {
    console.error("DELETE /articles error:", error);
    return NextResponse.json({ error: "خطا در حذف مقاله" }, { status: 500 });
  }
}
