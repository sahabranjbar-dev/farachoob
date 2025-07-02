import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import cloudinary from "@/lib/cloudinary";

// 🎯 اسکیما برای اعتبارسنجی ورودی هنگام PUT
const productUpdateSchema = z.object({
  farsiTitle: z.string().min(1, "نام فارسی محصول الزامی است."),
  englishTitle: z.string().min(1, "نام انگلیسی محصول الزامی است."),
  price: z.string(),
  stock: z.string(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  colors: z.array(z.string()).optional().default([]),
  comments: z.array(z.string()).optional().default([]),
  image: z.any().optional(),
});
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "شناسه محصول الزامی است." },
        { status: 400 }
      );
    }

    const formData = await req.formData();

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
      image: formData.get("image"),
    };

    const parsed = productUpdateSchema.safeParse(rawData);
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
      description,
      brandId,
      categoryId,
      colors,
      comments,
      image,
    } = parsed.data;

    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "محصولی با این شناسه یافت نشد." },
        { status: 404 }
      );
    }

    let imageUrl: string | undefined = undefined;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
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

    const updated = await prisma.product.update({
      where: { id },
      data: {
        farsiTitle,
        englishTitle,
        price: Number(price),
        stock: Number(stock),
        description,
        image: imageUrl || existing.image,
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

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("خطای ویرایش محصول:", error);
    return NextResponse.json(
      { error: "خطا در ویرایش محصول." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "شناسه محصول الزامی است." },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "محصولی با این شناسه یافت نشد." },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      message: "محصول با موفقیت حذف شد.",
      id,
    });
  } catch (error) {
    console.error("خطای حذف محصول:", error);
    return NextResponse.json({ error: "خطا در حذف محصول." }, { status: 500 });
  }
}
