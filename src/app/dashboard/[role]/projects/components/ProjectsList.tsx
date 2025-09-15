"use client";
import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";

const ProjectsList = () => {
  const columns = useMemo<ITableColumns[]>(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "title",
        title: "نام پروژه",
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
              deleterUrl={`/dashboard/projects/${v}`}
              key={v}
              title={row?.title}
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

export default ProjectsList;
