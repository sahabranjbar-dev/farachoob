import React from "react";
import ProductsForm from "../components/ProductsForm";

interface IProductsFormPage {
  searchParams: Promise<{ pageType: string; id: string }>;
}

const ProductsFormPage = async ({ searchParams }: IProductsFormPage) => {
  const reasolvedSearchParams = await searchParams;
  const { id } = reasolvedSearchParams;

  if (id) {
    const product = await prisma?.product.findUnique({
      where: { id },
    });

    const sanitizedProduct = product
      ? {
          ...product,
          brandId: product.brandId ?? undefined,
          categoryId: product.categoryId ?? undefined,
          stock: product.stock ?? undefined,
          image: product.image, // always null, since we can't convert string to File here
          description: product.description ?? undefined,
          updateAt: product.updateAt ?? undefined,
          price: product.price ?? undefined, // Ensure price is undefined, not null
        }
      : undefined;

    return <ProductsForm initialData={sanitizedProduct} />;
  }
  return <ProductsForm />;
};

export default ProductsFormPage;
