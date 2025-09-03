import React from "react";
import ProductPage from "../components/ProductPage";

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
    return <ProductPage productData={productData} />;
  }
};

export default ProductPageWrapper;
