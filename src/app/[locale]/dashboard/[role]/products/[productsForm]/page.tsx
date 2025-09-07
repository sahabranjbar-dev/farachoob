import React from "react";
import ProductsForm, { FormValues } from "../components/ProductsForm";
import prisma from "@/lib/prisma";

interface IProductsFormPage {
  searchParams: Promise<{ pageType: string; id: string }>;
}

const ProductsFormPage = async ({ searchParams }: IProductsFormPage) => {
  const reasolvedSearchParams = await searchParams;
  const { id } = reasolvedSearchParams;

  let sanitizedProduct: Partial<FormValues> = {};

  if (id) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          variations: {
            include: {
              images: true,
            },
          },
        },
      });

      if (product) {
        sanitizedProduct = {
          ...product,
          brandId: product.brandId ?? undefined,
          categoryId: product.categoryId ?? undefined,
          stock: product.stock ?? undefined,
          variations:
            product.variations.map((item) => ({
              imageUrl: item.images?.[0]?.url ?? "", // اگر فقط اولین تصویر رو میخوای
              colorCode: item.colorCode ?? "",
              colorName: item.colorName ?? "",
              id: item.id ?? "",
              price: item.price ?? 0,
              stock: item.stock ?? 0,
            })) ?? [],

          description: product.description ?? undefined,
          price: product.price ?? undefined,
        };
      }
    } catch (error: any) {
      console.error("خطا در دریافت محصول:", error);
    }
  }

  return <ProductsForm initialData={sanitizedProduct} />;
};

export default ProductsFormPage;
