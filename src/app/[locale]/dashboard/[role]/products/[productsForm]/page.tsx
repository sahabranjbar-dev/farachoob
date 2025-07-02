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
          // Convert image string to null if not present, as FormValues expects File | null | undefined
          image: undefined, // or null, depending on your FormValues default
          description: product.description ?? undefined,
          updateAt: product.updateAt ?? undefined,
        }
      : undefined;

    return <ProductsForm initialData={sanitizedProduct} />;
  }
  return <ProductsForm />;
};

export default ProductsFormPage;
