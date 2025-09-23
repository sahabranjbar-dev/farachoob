import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";

import { NextRequest, NextResponse } from "next/server";

// 🟢 آپلود فایل به لیارا

// ------------------ GET ------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brand") || undefined;
    const categoryId = searchParams.get("category") || undefined;
    const sort = searchParams.get("sort") || "latest";
    const inStock = searchParams.get("inStock") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "9", 10);

    if (isNaN(page) || page < 1)
      return NextResponse.json({ error: "صفحه نامعتبر است." }, { status: 400 });
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100)
      return NextResponse.json(
        { error: "pageSize نامعتبر است." },
        { status: 400 }
      );

    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (inStock) where.stock = { gt: 0 };

    let orderBy: any;
    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "latest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        return NextResponse.json(
          { error: "پارامتر مرتب‌سازی نامعتبر است." },
          { status: 400 }
        );
    }

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: { brand: true, category: true },
      }),
      prisma.product.count({ where }),
    ]);

    const resultList = products.map((item, index) => ({
      ...item,
      rowNumber: skip + index + 1,
    }));

    return NextResponse.json({
      resultList,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch (error) {
    console.error("خطای سرور:", error);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد." },
      { status: 500 }
    );
  }
}

// ------------------ POST ------------------
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const farsiTitle = formData.get("farsiTitle") as string;
    const englishTitle = formData.get("englishTitle") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock") ?? 0);
    const description = (formData.get("description") as string) || null;
    const brandId = (formData.get("brandId") as string) || null;
    const categoryId = (formData.get("categoryId") as string) || null;
    const comments = (formData.getAll("comments") as string[]).filter(Boolean);

    const variations: any[] = [];
    let i = 0;
    while (
      formData.has(`variations[${i}].colorName`) ||
      formData.has(`variations[${i}].price`)
    ) {
      const colorName = formData.get(`variations[${i}].colorName`) as string;
      const colorCode = formData.get(`variations[${i}].colorCode`) as string;
      const vPrice = Number(formData.get(`variations[${i}].price`));
      const vStock = Number(formData.get(`variations[${i}].stock`) ?? 0);

      const files = (
        formData.getAll(`variations[${i}].image`) as File[]
      ).filter((f) => f && f.size > 0 && f.type?.startsWith("image/"));

      const uploadedUrls = [];
      for (const file of files)
        uploadedUrls.push(await uploadFile(file, "products/variations"));

      variations.push({
        colorName,
        colorCode,
        price: vPrice,
        stock: vStock,
        images: uploadedUrls,
      });
      i++;
    }

    const product = await prisma.product.create({
      data: {
        farsiTitle,
        englishTitle,
        price,
        stock,
        description,
        comments,
        ...(brandId && { brand: { connect: { id: brandId } } }),
        ...(categoryId && { category: { connect: { id: categoryId } } }),
        variations: {
          create: variations.map((v) => ({
            colorName: v.colorName,
            colorCode: v.colorCode,
            price: v.price,
            stock: v.stock,
            images: { create: v.images.map((url: string) => ({ url })) },
          })),
        },
      },
      include: { variations: { include: { images: true, product: true } } },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("❌ خطای ساخت محصول:", error);
    return NextResponse.json({ error: "خطا در ساخت محصول." }, { status: 500 });
  }
}

// ------------------ PUT ------------------
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const productId = formData.get("id") as string;
    if (!productId)
      return NextResponse.json(
        { error: "شناسه محصول الزامی است." },
        { status: 400 }
      );

    const farsiTitle = formData.get("farsiTitle") as string;
    const englishTitle = formData.get("englishTitle") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock") ?? 0);
    const description = (formData.get("description") as string) || null;
    const brandId = (formData.get("brandId") as string) || null;
    const categoryId = (formData.get("categoryId") as string) || null;
    const comments = (formData.getAll("comments") as string[]).filter(Boolean);

    const variations: any[] = [];
    let i = 0;
    while (
      formData.has(`variations[${i}].colorName`) ||
      formData.has(`variations[${i}].price`)
    ) {
      const colorName = formData.get(`variations[${i}].colorName`) as string;
      const colorCode = formData.get(`variations[${i}].colorCode`) as string;
      const vPrice = Number(formData.get(`variations[${i}].price`));
      const vStock = Number(formData.get(`variations[${i}].stock`) ?? 0);

      const files = (
        formData.getAll(`variations[${i}].image`) as File[]
      ).filter((f) => f && f.size > 0 && f.type?.startsWith("image/"));

      const uploadedUrls = [];
      for (const file of files)
        uploadedUrls.push(await uploadFile(file, "products/variations"));

      variations.push({
        colorName,
        colorCode,
        price: vPrice,
        stock: vStock,
        images: uploadedUrls,
      });
      i++;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        farsiTitle,
        englishTitle,
        price,
        stock,
        description,
        comments,
        ...(brandId && { brand: { connect: { id: brandId } } }),
        ...(categoryId && { category: { connect: { id: categoryId } } }),
        variations: {
          deleteMany: {},
          create: variations.map((v) => ({
            colorName: v.colorName,
            colorCode: v.colorCode,
            price: v.price,
            stock: v.stock,
            images: { create: v.images.map((url: string) => ({ url })) },
          })),
        },
      },
      include: { variations: { include: { images: true, product: true } } },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("❌ خطای آپدیت محصول:", error);
    return NextResponse.json({ error: "خطا در آپدیت محصول." }, { status: 500 });
  }
}
