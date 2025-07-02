"use client";
import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";

const CategoriesList = () => {
  const columns = useMemo<ITableColumns[]>(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "farsiTitle",
        title: "نام فارسی دسته‌بندی",
      },
      {
        field: "englishTitle",
        title: "نام انگلیسی دسته‌بندی",
      },
      {
        field: "id",
        title: "عملیات",
        render(v, row, meta) {
          return <RowFormButtons id={v} deleterUrl="" title={row.farsiTitle} />;
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

export default CategoriesList;
