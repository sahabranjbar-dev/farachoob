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
        field: "name",
        title: "نام کاربر",
      },
      {
        field: "email",
        title: "ایمیل",
      },
      {
        field: "role",
        title: "نقش",
      },
      {
        field: "createdAt",
        title: "تاریخ ثبت",
      },
      {
        field: "",
        title: "دسترسی",
      },
      {
        field: "id",
        title: "عملیات",
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
