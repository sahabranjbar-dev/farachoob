// app/api/dashboard/products/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
      },
    });

    // داده‌ها را برای اکسل آماده می‌کنیم
    const data = products.map((p) => ({
      id: p.id, // اضافه کردن ستون id
      farsiTitle: p.farsiTitle,
      englishTitle: p.englishTitle,
      price: p.price,
      brandName: p.brand?.farsiTitle ?? "",
      categoryName: p.category?.farsiTitle ?? "",
      stock: p.stock,
      description: p.description,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": "attachment; filename=products.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
