"use client";
import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import { Check, Clock } from "lucide-react";
import { useMemo } from "react";
import ApproveComments from "./ApproveComments";
import useDataGetter from "@/hooks/useDataGetter";

const CommentsList = () => {
  const { data, fetch: approveComment } = useDataGetter({
    url: "/dashboard/comments/approved",
    immediatelyFetch: false,
    showError: true,
    showSuccessMessage: true,
    method: "PUT",
  });

  const changeApprovedHandler = async (
    commentId: string,
    isApproved: boolean
  ) => {
    return await approveComment?.({
      inputBody: {
        commentId,
        isApproved,
      },
    }).then((data) => {
      return data;
    });
  };

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
        field: "isApproved",
        title: "تاریخ ایجاد",
        render(v) {
          return (
            <div className="flex justify-center items-center gap-2">
              {v ? (
                <>
                  <Check className="text-green-600" />
                  <span className="text-green-600">تایید شده</span>
                </>
              ) : (
                <>
                  <Clock className="text-orange-600" />
                  <span className="text-orange-500">منتظر تایید</span>
                </>
              )}
            </div>
          );
        },
      },
      {
        field: "id",
        title: "عملیات",
        width: "100px",
        render: (v, row) => {
          return (
            <ApproveComments
              comment={row}
              key={v}
              onApprove={(commentId) => changeApprovedHandler(commentId, true)}
              onReject={(commentId) => changeApprovedHandler(commentId, false)}
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

export default CommentsList;
