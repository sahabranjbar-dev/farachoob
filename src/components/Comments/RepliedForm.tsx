"use client";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { CircleX, Reply, ThumbsDown, ThumbsUp } from "lucide-react";
import CommentForm from "@/app/[locale]/blogs/components/CommentForm";
import useDataGetter from "@/hooks/useDataGetter";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Likes, User } from "@/types/common";
import { cn } from "@/lib/utils";

interface Props {
  commentId?: string;
  articleId: string;
  likes?: Likes[];
  user?: User | null;
  mutate?: () => void;
  isValidating?: boolean;
}

const RepliedForm = ({
  commentId,
  articleId,
  likes,
  isValidating,
  mutate,
  user,
}: Props) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const session = useSession();
  const { fetch, data, loading } = useDataGetter({
    url: "/comment/likes",
    method: "POST",
    immediatelyFetch: false,
    showError: true,
    body: {
      commentId,
      userId: session?.data?.user?.id,
    },
    onSuccess(data) {
      console.log({ data });
      toast.success(data?.message);
      mutate?.();
    },
  });

  const userId = session?.data?.user?.id;
  const liked = !!likes?.find((like) => like.userId === userId);

  return (
    <>
      <div className="flex justify-start items-center m-2">
        <Button
          onClick={() => {
            setShowForm(!showForm);
          }}
          left={showForm ? <CircleX /> : <Reply />}
          variant="ghost"
          className="underline"
        >
          {showForm ? "بستن فرم جواب" : "پاسخ"}
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (session?.status === "unauthenticated") {
              toast.error("ابتدا وارد سایت شوید");
              return;
            }
            fetch?.({});
          }}
          tooltip={liked ? "دیسلایک این نظر" : "لایک این نظر"}
          left={<ThumbsUp size={256} color={liked ? "#14930b" : "black"} />}
          variant="ghost"
          className="underline disabled:cursor-not-allowed disabled:bg-gray-50"
          disabled={loading || isValidating}
        />
        {likes?.length ? `(${likes?.length})` : null}
      </div>
      {showForm && (
        <div className="w-[80%] justify-self-end bg-orange-400 rounded-xl p-2">
          <CommentForm
            key={commentId}
            articleId={articleId}
            title="پاسخ نظر"
            commentId={commentId}
            mutate={mutate}
            closeForm={() => {
              setShowForm(false);
            }}
          />
        </div>
      )}
    </>
  );
};

export default RepliedForm;
