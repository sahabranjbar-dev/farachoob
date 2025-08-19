"use client";
import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";

const BlogsList = () => {
  const columns: ITableColumns[] = useMemo(
    () => [
      {
        field: "title",
        title: "عنوان",
      },
      {
        field: "author",
        title: "نویسنده",
        render: (author) => `${author.firstName} ${author.lastName}`,
      },
      { field: "createdAt", title: "تاریخ ایجاد", hasDateFormatter: true },
      {
        field: "published",
        title: "وضعیت",
        render: (v) => (v ? "منتشر شده" : "پیش‌نویس"),
      },
      {
        field: "id",
        title: "عملیات",
        render: (id) => <RowFormButtons id={id} />,
      },
    ],
    []
  );
  return (
    <ListDataProvider>
      <Table data={[]} columns={columns} />
    </ListDataProvider>
  );
};

export default BlogsList;
