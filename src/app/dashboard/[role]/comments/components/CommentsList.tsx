"use client";
import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";
import ApproveComments from "./ApproveComments";

const CommentsList = () => {
  const columns: ITableColumns[] = useMemo(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "content",
        title: "محتوا",
      },
      {
        field: "user",
        title: "کاربر",
        render(v) {
          return v?.firstName;
        },
      },
      {
        field: "replies",
        title: "پاسخ‌ها",
        render: (v: string[], row) => {
          return v?.length;
        },
      },
      {
        field: "likes",
        title: "لایک‌ها",
        render: (v: string[], row) => {
          return v?.length;
        },
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
          return <ApproveComments comment={row} key={v} />;
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

export default CommentsList;
