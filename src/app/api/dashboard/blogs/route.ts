import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // فیلترها
    const title = searchParams.get("title") || undefined;
    // پجینیشن
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    // سورت
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const allowedSortFields = ["title", "publishedAt", "createdAt", "updateAt"];
    const validatedSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const filters = {
      AND: [title ? { title: { contains: title } } : {}],
    };

    const totalItems = await prisma?.article.count({ where: filters });

    const articles = await prisma?.article.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [validatedSortBy]: sortOrder },
      select: {
        id: true,
        title: true,
        content: true,
        coverImage: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            email: true,
            image: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const articleData = articles?.map((article, index) => ({
      rowNumber: (page - 1) * pageSize + index + 1,
      id: article.id,
      title: article.title,
      content: article.content,
      coverImage: article.coverImage,
      published: article.published,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updateAt: article.updatedAt,
      author: {
        id: article.author.id,
        firstName: article.author.firstName,
        lastName: article.author.lastName,
        email: article.author.email,
        image: article.author.image,
      },
    }));

    return NextResponse.json({
      resultList: articleData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil((totalItems ?? 0) / pageSize),
    });
  } catch (error) {
    console.error("GET /articles error:", error);
    return NextResponse.json(
      { message: "خطا در دریافت مقالات" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();

    const image = formData.get("coverImage") as File | null;

    if (!image || !image.type.startsWith("image/")) {
      return NextResponse.json({ error: "فایل معتبر نیست" }, { status: 400 });
    }

    const coverImage = await uploadFile(image, "blogs");

    const newArticle = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      coverImage,
      published: formData.get("published") === "true",
      author: {
        connect: { id: session.user.id },
      },
    };

    const createdArticle = await prisma?.article.create({
      data: newArticle,
    });

    if (!createdArticle) {
      return NextResponse.json(
        { error: "ایجاد مقاله ناموفق بود" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: "مقاله با موفقیت ایجاد شد",
      article: {
        id: createdArticle.id,
        title: createdArticle.title,
        content: createdArticle.content,
        coverImage: createdArticle.coverImage,
        published: createdArticle.published,
        publishedAt: createdArticle.publishedAt,
        createdAt: createdArticle.createdAt,
        updatedAt: createdArticle.updatedAt,
      },
    });
  } catch (error) {
    console.error("POST /articles error:", error);

    return NextResponse.json({ error: "آپلود ناموفق" }, { status: 500 });
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
