"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useDataGetter from "@/hooks/useDataGetter";
import useSWR, { mutate } from "swr";
import Image from "next/image";

// ✅ اسکیمای ولیدیشن
const CommentSchema = z.object({
  content: z
    .string()
    .min(3, "نظر باید حداقل ۳ کاراکتر باشد")
    .max(500, "نظر نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"),
  captcha: z.string().min(4, "کپچا الزامی است"),
});

type CommentFormValues = z.infer<typeof CommentSchema>;

interface Props {
  articleId: string;
  title?: string;
  commentId?: string;
  mutate?: () => void;
  closeForm?: () => void;
  parentId?: string;
}

export default function CommentForm({
  articleId,
  title = "ثبت نظر",
  commentId,
  mutate,
  closeForm,
}: Props) {
  const session = useSession();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(CommentSchema),
  });

  const { fetch: fetchCaptcha, data } = useDataGetter({
    url: "/captcha",
    responseType: "blob",
  });

  const {
    data: commmentData,
    fetch: addComment,
    loading: addCommentLoading,
    error: addCommentError,
  } = useDataGetter({
    url: "/comment",
    method: "POST",
    immediatelyFetch: false,
    onSuccess: (data) => {
      toast.success(data?.message, {
        position: "bottom-center",
      });
      reset();
      mutate?.();
      closeForm?.();
    },
    onFailure(error) {
      toast.error(error?.response?.data?.error, {
        position: "bottom-center",
      });
    },
  });

  const onSubmit = async (data: CommentFormValues) => {
    if (session?.status === "unauthenticated") {
      toast.error("لطفا ابتدا وارد شوید");
      return;
    }

    addComment?.({
      inputBody: {
        articleId,
        content: data.content,
        userId: session.data?.user.id,
        captcha: data.captcha,
        commentParentId: commentId,
      },
    }).finally(() => fetchCaptcha?.({}));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border bg-white dark:bg-black dark:border-2  p-6 shadow-md"
    >
      <h3 className="text-lg font-semibold">{title}</h3>

      {/* متن نظر */}
      <div>
        <Textarea
          placeholder="نظر خود را بنویسید..."
          {...register("content")}
          required={false}
          className="dark:bg-gray-800"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      {/* کپچا */}
      <div className="flex items-center gap-2">
        {data ? (
          <Image
            src={URL.createObjectURL(data)}
            alt="CAPTCHA"
            className="cursor-pointer rounded border border-gray-300"
            unoptimized
          />
        ) : (
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
        )}
        <Button
          onClick={() => fetchCaptcha?.({})}
          type="button"
          size="icon"
          variant="ghost"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="">
        <Input
          placeholder="کپچا"
          {...register("captcha")}
          required={false}
          className="dark:bg-gray-800"
        />
        {errors.captcha && (
          <p className="mt-1 text-sm text-red-500">{errors.captcha.message}</p>
        )}
      </div>

      <Button
        variant="primary"
        type="submit"
        disabled={addCommentLoading}
        className="dark:**:text-gray-200"
      >
        {addCommentLoading ? "در حال ارسال..." : "ثبت نظر"}
      </Button>
    </form>
  );
}
