import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// تنظیمات Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file: File, folder = "products") => {
  const buffer = Buffer.from(await file.arrayBuffer()); // ← اینجا await در تابع async
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result?.secure_url!);
      })
      .end(buffer);
  });
};

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

const variationSchema = z.object({
  colorName: z.string().optional(),
  colorCode: z.string().optional(),
  price: z.preprocess((val) => {
    if (typeof val === "string") return Number(val.replace(/,/g, ""));
    return val;
  }, z.number().nonnegative()),
  stock: z.preprocess((val) => {
    if (typeof val === "string") return Number(val);
    return val;
  }, z.number().int().nonnegative()),
  images: z.array(z.string().url()).optional().default([]),
});

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
  comments: z.array(z.string()).optional().default([]),
  variations: z.array(variationSchema).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 🟢 فیلدهای اصلی محصول
    const farsiTitle = formData.get("farsiTitle") as string;
    const englishTitle = formData.get("englishTitle") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock") ?? 0);
    const description = (formData.get("description") as string) || null;
    const brandId = (formData.get("brandId") as string) || null;
    const categoryId = (formData.get("categoryId") as string) || null;
    const comments = formData.getAll("comments") as string[];

    // 🟢 گرفتن ورییشن‌ها از فرم
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

      // 🖼️ آپلود عکس‌های ورییشن
      const files = formData.getAll(`variations[${i}].image`) as File[];
      const uploadedUrls: string[] = [];
      console.log({ files });

      for (const file of files) {
        if (file && file.size > 0 && file.type.startsWith("image/")) {
          const url = await uploadFile(file, "products/variations");
          console.log({ url });

          uploadedUrls.push(url);
        }
      }

      variations.push({
        colorName,
        colorCode,
        price: vPrice,
        stock: vStock,
        images: uploadedUrls,
      });

      i++;
    }

    // 🟢 ذخیره در دیتابیس
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
            images: {
              create: v.images.map((url: string) => ({ url })),
            },
          })),
        },
      },
      include: {
        variations: {
          include: { images: true, product: true },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("❌ خطای ساخت محصول:", error);
    return NextResponse.json({ error: "خطا در ساخت محصول." }, { status: 500 });
  }
}

// اسکیما برای اعتبارسنجی PUT
const productUpdateSchema = z.object({
  id: z.string().min(1),
  farsiTitle: z.string().min(1, "نام فارسی محصول الزامی است."),
  englishTitle: z.string().min(1, "نام انگلیسی محصول الزامی است."),
  price: z.string().optional(),
  stock: z.string().optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  colors: z.array(z.string()).optional().default([]),
  comments: z.array(z.string()).optional().default([]),
  image: z.any().optional(),
});

// // PUT: ویرایش محصول
// export async function PUT(req: NextRequest) {
//   try {
//     const formData = await req.formData();

//     const rawData = {
//       id: formData.get("id"),
//       farsiTitle: formData.get("farsiTitle"),
//       englishTitle: formData.get("englishTitle"),
//       price: formData.get("price") ?? 0,
//       stock: formData.get("stock") ?? 0,
//       brandId: formData.get("brandId"),
//       categoryId: formData.get("categoryId"),
//       description: formData.get("description"),
//       colors: formData.getAll("colors"),
//       comments: formData.getAll("comments"),
//       image: formData.get("image"),
//     };

//     const parsed = productUpdateSchema.safeParse(rawData);
//     if (!parsed.success) {
//       return NextResponse.json(
//         { error: parsed.error.flatten() },
//         { status: 400 }
//       );
//     }

//     const {
//       id,
//       farsiTitle,
//       englishTitle,
//       price,
//       stock,
//       description,
//       brandId,
//       categoryId,
//       colors,
//       comments,
//       image,
//     } = parsed.data;

//     const existing = await prisma.product.findUnique({ where: { id } });
//     if (!existing)
//       return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });

//     let imageUrl = existing.image;
//     const imageFile = formData.get("image") as File | null;
//     if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
//       const buffer = Buffer.from(await imageFile.arrayBuffer());
//       const uploadRes = await new Promise((resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream({ folder: "products" }, (err, result) => {
//             if (err) reject(err);
//             else resolve(result);
//           })
//           .end(buffer);
//       });
//       imageUrl = (uploadRes as any).secure_url;
//     }

//     const updated = await prisma.product.update({
//       where: { id },
//       data: {
//         farsiTitle,
//         englishTitle,
//         price: Number(price),
//         stock: Number(stock),
//         description,
//         image: imageUrl,
//         colors,
//         comments,
//         ...(brandId && { brand: { connect: { id: brandId } } }),
//         ...(categoryId && { category: { connect: { id: categoryId } } }),
//       },
//     });

//     return NextResponse.json(updated, { status: 200 });
//   } catch (error) {
//     console.error("خطای ویرایش محصول:", error);
//     return NextResponse.json(
//       { error: "خطا در ویرایش محصول." },
//       { status: 500 }
//     );
//   }
// }

// // DELETE: حذف محصول
// export async function DELETE(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const id = body.id;
//     if (!id)
//       return NextResponse.json(
//         { error: "شناسه محصول الزامی است." },
//         { status: 400 }
//       );

//     const existing = await prisma.product.findUnique({ where: { id } });
//     if (!existing)
//       return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });

//     await prisma.product.delete({ where: { id } });
//     return NextResponse.json({ message: "محصول با موفقیت حذف شد.", id });
//   } catch (error) {
//     console.error("خطای حذف محصول:", error);
//     return NextResponse.json({ error: "خطا در حذف محصول." }, { status: 500 });
//   }
// }
