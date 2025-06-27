"use client";
import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";

const MenusList = () => {
  const columns = useMemo<ITableColumns[]>(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "title",
        title: "عنوان",
      },
      {
        field: "href",
        title: "آدرس",
      },
      {
        field: "icon",
        title: "آیکن",
      },
      {
        field: "permission",
        title: "دسترسی",
        render(v) {
          return v?.description;
        },
      },
      {
        field: "status",
        title: "وضعیت",
        render(v, row, meta) {
          return v ? "فعال" : "غیرفعال";
        },
      },
      {
        field: "id",
        title: "عملیات",
        render: (v, row) => {
          return (
            <RowFormButtons
              id={v}
              key={v}
              deleterUrl={`/dashboard/menus/${v}`}
              title={row.title}
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

export default MenusList;
