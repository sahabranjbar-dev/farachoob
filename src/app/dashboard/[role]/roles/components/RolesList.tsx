"use client";
import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import TruncatedText from "@/components/TruncatedText";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";

const RolesList = () => {
  const columns = useMemo<ITableColumns[]>(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "farsiTitle",
        title: "عنوان فارسی",
      },
      {
        field: "englishTitle",
        title: "عنوان انگلیسی",
      },
      {
        field: "permissions",
        title: "دسترسی‌های این نقش",
        render(v, row, meta) {
          return v?.length
            ? TruncatedText({
                text: v?.map((item: any) => item?.permission?.title).join(","),
                maxLengthDesktop: 50,
              })
            : "---";
        },
      },
      {
        field: "description",
        title: "توضیحات",
        render: (v) => (v ? v : "---"),
      },
      {
        field: "status",
        title: "وضعیت",
        render(v, row, meta) {
          return v ? (
            <div className="text-green-600">فعال</div>
          ) : (
            <div className="text-red-600">غیرفعال</div>
          );
        },
      },
      {
        field: "id",
        title: "عملیات",
        render: (v, row) => {
          return (
            <RowFormButtons
              id={v}
              deleterUrl={`/dashboard/roles/${v}`}
              title={row.farsiTitle}
              key={v}
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

export default RolesList;
