import React from "react";
import RepliedForm from "./RepliedForm";
import { Comment } from "@/types/common";

interface Props extends Comment {
  name: string;
  articleId: string;
  mutate?: () => void;
  isValidating?: boolean;
}

const CommentItem = ({
  articleId,
  content,
  updatedAt,
  id,
  name,
  replies,
  likes,
  user,
  mutate,
  isValidating,
}: Props) => {
  return (
    <div className="bg-gray-50 border rounded-xl p-4 shadow-sm m-4">
      <p className="text-gray-700 mb-2">{content}</p>
      <div className="text-xs text-gray-500 flex justify-between">
        <span>{name}</span>
        <span>
          {updatedAt ? new Date(updatedAt).toLocaleString("fa") : "لحظاتی پیش"}
        </span>
      </div>
      <RepliedForm
        articleId={articleId}
        commentId={id}
        likes={likes}
        user={user}
        mutate={mutate}
        isValidating={isValidating}
      />
      {Boolean(replies?.length) &&
        replies?.map((reply) => (
          <CommentItem
            key={reply.id}
            articleId={articleId}
            name={reply.user?.firstName || reply.user?.email || "میهمان"}
            content={reply.content}
            updatedAt={reply.updatedAt}
            id={reply.id}
            createdAt={reply.createdAt}
            replies={reply.replies}
            user={reply.user}
            likes={reply.likes}
            userId={reply.userId}
            mutate={mutate}
            parentId={reply.parentId}
          />
        ))}
    </div>
  );
};

export default CommentItem;
