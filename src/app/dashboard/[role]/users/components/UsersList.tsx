"use client";

import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import TruncatedText from "@/components/TruncatedText";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";

const UsersList = () => {
  const columns = useMemo<ITableColumns[]>(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "fullName",
        title: "نام کاربر",
      },
      {
        field: "email",
        title: "ایمیل",
      },
      {
        field: "mobile",
        title: "موبایل",
      },
      {
        field: "roleFarsiTitle",
        title: "نقش",
      },
      {
        field: "createdAt",
        title: "تاریخ ثبت",
        hasDateFormatter: true,
      },
      {
        field: "permissions",
        title: "دسترسی",
        render: (v) => {
          return v.length > 0
            ? TruncatedText({ text: v.join(", ") })
            : "بدون دسترسی";
        },
      },
      {
        field: "id",
        title: "عملیات",
        render: (v, row) => {
          return (
            <RowFormButtons
              id={v}
              deleterUrl={`/dashboard/users/${v}`}
              title={row.name}
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

export default UsersList;
