import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const brandId = searchParams.get("brand") || undefined;
    const categoryId = searchParams.get("category") || undefined;
    const sort = searchParams.get("sort") || "latest";
    const inStock = searchParams.get("inStock") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "9", 10);

    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: "صفحه نامعتبر است." }, { status: 400 });
    }

    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: "pageSize نامعتبر است." },
        { status: 400 }
      );
    }

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
        include: {
          brand: true,
          category: true,
        },
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

// اجازه دریافت FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ تعریف اسکیمای اعتبارسنجی با Zod
const productSchema = z.object({
  farsiTitle: z.string().min(1, "نام فارسی محصول الزامی است."),
  englishTitle: z.string().min(1, "نام انگلیسی محصول الزامی است."),
  price: z.preprocess((val) => {
    if (typeof val === "string") return Number(val.replace(/,/g, ""));
    return val;
  }, z.number().nonnegative("قیمت نمی‌تواند منفی باشد.")),
  stock: z
    .preprocess((val) => {
      if (typeof val === "string") return Number(val);
      return val;
    }, z.number().int().nonnegative())
    .optional()
    .default(0),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  colors: z.array(z.string()).optional().default([]),
  comments: z.array(z.string()).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 🟢 داده‌ها رو از فرم می‌گیریم
    const rawData = {
      farsiTitle: formData.get("farsiTitle"),
      englishTitle: formData.get("englishTitle"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      brandId: formData.get("brandId"),
      categoryId: formData.get("categoryId"),
      description: formData.get("description"),
      colors: formData.getAll("colors"),
      comments: formData.getAll("comments"),
    };

    const imageFile = formData.get("image") as File | null;

    // 🛡️ اعتبارسنجی
    const parsed = productSchema.safeParse(rawData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      farsiTitle,
      englishTitle,
      price,
      stock,
      brandId,
      categoryId,
      description,
      colors,
      comments,
    } = parsed.data;

    // 🖼️ آپلود تصویر اگر وجود داشت
    let imageUrl: string | undefined;
    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "فقط فایل‌های تصویری مجاز هستند." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = (uploadRes as any).secure_url;
    }

    const product = await prisma.product.create({
      data: {
        farsiTitle,
        englishTitle,
        price,
        stock,
        description,
        image: imageUrl,
        colors,
        comments,
        ...(brandId && {
          brand: { connect: { id: brandId } },
        }),
        ...(categoryId && {
          category: { connect: { id: categoryId } },
        }),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("خطای ساخت محصول:", error);
    return NextResponse.json({ error: "خطا در ساخت محصول." }, { status: 500 });
  }
}
