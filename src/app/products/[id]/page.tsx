import React from "react";
import ProductPage from "../components/ProductPage";
import prisma from "@/lib/prisma";

interface IProductPageWrapper {
  params: Promise<{ id: string }>;
}

const ProductPageWrapper = async ({ params }: IProductPageWrapper) => {
  const reasolvedSearchParams = await params;

  const { id } = reasolvedSearchParams;

  if (id) {
    const productData = await prisma?.product?.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variations: {
          include: {
            images: true,
          },
        },
      },
    });
    if (!productData) {
      return <div>محصولی یافت نشد</div>;
    }
    // Map variations to ensure colorName and colorCode are undefined instead of null
    const fixedProductData = {
      ...productData,
      variations: productData.variations.map((variation: any) => ({
        ...variation,
        colorName:
          variation.colorName === null ? undefined : variation.colorName,
        colorCode:
          variation.colorCode === null ? undefined : variation.colorCode,
      })),
    };
    return <ProductPage productData={fixedProductData} />;
  }
};

export default ProductPageWrapper;
