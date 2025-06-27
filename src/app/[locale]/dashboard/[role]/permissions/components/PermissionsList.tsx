import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";

const PermissionsList = () => {
  const columns = useMemo<ITableColumns[]>(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "farsiTitle",
        title: "نام فارسی",
      },
      {
        field: "englishTitle",
        title: "نام انگلیسی",
      },
      {
        field: "roles",
        title: "نقش‌هایی که این دسترسی را دارند",
        render(v, row, meta) {
          return v?.length
            ? v?.map((item: any) => item?.role?.farsiTitle).join(",")
            : "---";
        },
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
        render: (v, row) => {
          return (
            <RowFormButtons
              id={v}
              deleterUrl={`/dashboard/permissions/${v}`}
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

export default PermissionsList;
