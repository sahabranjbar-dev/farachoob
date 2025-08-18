"use client";
import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";

const RepresentativesList = () => {
  const columns: ITableColumns[] = useMemo(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "firstName",
        title: "نام",
        width: "150px",
      },
      {
        field: "lastName",
        title: "نام خانوادگی",
        width: "150px",
      },
      {
        field: "mobile",
        title: "شماره تماس",
        width: "150px",
      },
      {
        field: "address",
        title: "آدرس",
        width: "200px",
      },
      {
        field: "city",
        title: "شهر",
        width: "100px",
      },
      {
        field: "province",
        title: "استان",
        width: "100px",
      },
      {
        field: "id",
        title: "عملیات",
        width: "100px",
        render: (value) => <RowFormButtons id={value} />,
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

export default RepresentativesList;
