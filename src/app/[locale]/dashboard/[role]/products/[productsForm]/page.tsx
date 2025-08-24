import React from "react";
import ProductsForm from "../components/ProductsForm";
import { prisma } from "@/lib/prisma"; // مطمئن شو prisma import شده

interface IProductsFormPage {
  searchParams: Promise<{ pageType: string; id: string }>;
}

const ProductsFormPage = async ({ searchParams }: IProductsFormPage) => {
  const reasolvedSearchParams = await searchParams;
  const { id } = reasolvedSearchParams;

  let sanitizedProduct = undefined;

  if (id) {
    try {
      const product = await prisma?.product?.findUnique({
        where: { id },
      });

      if (product) {
        sanitizedProduct = {
          ...product,
          brandId: product.brandId ?? undefined,
          categoryId: product.categoryId ?? undefined,
          stock: product.stock ?? undefined,
          image: product.image, // always null, since we can't convert string to File here
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
