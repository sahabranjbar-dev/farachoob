"use client";
import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";

const ProductsList = () => {
  const columns = useMemo<ITableColumns[]>(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "farsiTitle",
        title: "نام فارسی محصول",
      },
      {
        field: "englishTitle",
        title: "نام انگلیسی محصول",
      },
      {
        field: "description",
        title: "توضیحات",
      },
      {
        field: "price",
        title: "قیمت",
        render(v, row, meta) {
          return Number(v).toLocaleString("fa");
        },
      },
      {
        field: "stock",
        title: "موجودی",
      },
      {
        field: "discount",
        title: "تخفیف",
      },
      {
        field: "createdAt",
        title: "تاریخ ایجاد",
        hasDateFormatter: true,
      },
      {
        field: "updateAt",
        title: "تاریخ ویرایش",
        hasDateFormatter: true,
      },
      {
        field: "id",
        title: "عملیات",
        render(v, row, meta) {
          return (
            <RowFormButtons
              id={v}
              deleterUrl={`/dashboard/product/${v}`}
              title={row.title}
              hasPage
            />
          );
        },
      },
    ],
    []
  );
  return (
    <ListDataProvider>
      <Table columns={columns} data={[]} />
    </ListDataProvider>
  );
};

export default ProductsList;
