"use client";

import useSWR from "swr";
import CommentItem from "./CommentItem";
import { Skeleton } from "../ui/skeleton";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Comment } from "@/types/common";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Props {
  articleId: string;
}

export default function Comments({ articleId }: Props) {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `/api/comment?articleId=${articleId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // 🔹 لودینگ
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border rounded-xl p-4 shadow-sm bg-gray-50 dark:bg-gray-900 space-y-2"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // 🔹 خطا
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border border-red-300 bg-red-50 rounded-xl">
        <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
        <p className="text-red-600 font-medium">خطا در گرفتن نظرات</p>
        <button
          onClick={() => mutate()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  // 🔹 محتوای اصلی
  return (
    <div className="space-y-4">
      {data?.comments?.length ? (
        data.comments.map((c: Comment) => (
          <CommentItem
            key={c.id}
            articleId={articleId}
            mutate={mutate}
            name={c.user?.firstName || c.user?.email || "میهمان"}
            content={c.content}
            id={c.id}
            userId={c.userId}
            createdAt={c.createdAt}
            likes={c.likes}
            replies={c.replies}
            updatedAt={c.updatedAt}
            user={c.user}
            parentId={c.parentId}
            isValidating={isValidating || isLoading}
          />
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-50 text-sm text-center">
          هنوز نظری ثبت نشده است
        </p>
      )}
    </div>
  );
}
