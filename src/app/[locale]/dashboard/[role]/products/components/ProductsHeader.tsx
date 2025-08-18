import ListHeader from "@/components/ListHeader/ListHeader";
import React from "react";

const ProductsHeader = () => {
  return (
    <ListHeader
      title="فرم ایجاد محصول"
      hasExport
      exportUrl="/api/dashboard/products/export"
    />
  );
};

export default ProductsHeader;
