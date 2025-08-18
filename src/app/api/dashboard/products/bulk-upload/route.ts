import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "فایلی انتخاب نشده است" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

    const results = [];

    for (const item of jsonData) {
      const englishTitleStr = item.englishTitle?.toString() ?? "";

      // پیدا کردن brandId و categoryId با نام فارسی
      const brand = item.brandName
        ? await prisma.brand.findFirst({
            where: { farsiTitle: item.brandName },
          })
        : null;
      const category = item.categoryName
        ? await prisma.category.findFirst({
            where: { farsiTitle: item.categoryName },
          })
        : null;

      let product;
      if (item.id) {
        // اگر id موجود بود → آپدیت
        product = await prisma.product.update({
          where: { id: String(item.id) },
          data: {
            farsiTitle: item.farsiTitle ?? "",
            englishTitle: englishTitleStr,
            price: Number(item.price ?? 0),
            brandId: brand?.id ?? null,
            categoryId: category?.id ?? null,
            stock: Number(item.stock ?? 0),
            description: item.description ?? "",
          },
        });
      } else {
        // ایجاد محصول جدید
        product = await prisma.product.create({
          data: {
            farsiTitle: item.farsiTitle ?? "",
            englishTitle: englishTitleStr,
            price: Number(item.price ?? 0),
            brandId: brand?.id ?? null,
            categoryId: category?.id ?? null,
            stock: Number(item.stock ?? 0),
            description: item.description ?? "",
          },
        });
      }

      results.push(product);
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
