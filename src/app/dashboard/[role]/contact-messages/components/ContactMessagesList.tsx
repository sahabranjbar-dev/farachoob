"use client";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import { useMemo } from "react";
import ShowMessageButtons from "./ShowMessageButtons";

const ContactMessagesList = () => {
  const columns: ITableColumns[] = useMemo(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "name",
        title: "نام و نام‌خانوادگی",
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
        field: "createdAt",
        title: "تاریخ ایجاد",
        hasDateFormatter: true,
      },
      {
        field: "id",
        title: "عملیات",
        render: (v, row) => {
          return <ShowMessageButtons message={row} />;
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

export default ContactMessagesList;
