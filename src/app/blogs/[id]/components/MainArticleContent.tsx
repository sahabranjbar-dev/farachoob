"use client";

import Comments from "@/components/Comments/Comments";
import { Article as ArticleType, Comment } from "@/types/common";
import DOMPurify from "isomorphic-dompurify";
import { CalendarDays, Loader2 } from "lucide-react";
import Image from "next/image";
import Article from "../../components/Article";
import CommentForm from "../../components/CommentForm";

interface Props {
  article: ArticleType & { comments: Comment[] };
}

const MainArticleContent = ({ article }: Props) => {
  return (
    <div className="lg:col-span-3">
      {/* تصویر مقاله */}
      <div className="relative h-56 sm:h-72 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={article.coverImage || "/images/placeholder.png"}
          alt={article.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* عنوان و محتوا */}
      <div className="mt-6 border p-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-200 mb-3">
          {article.title}
        </h1>
        <div className="flex justify-end items-center gap-2 text-gray-500 dark:text-gray-300 text-xs sm:text-sm mb-6">
          <span>آخرین ویرایش: {article?.updatedAt?.toLocaleString("fa")}</span>
          <CalendarDays size={16} />
        </div>

        {article.content ? (
          <Article safeContent={DOMPurify.sanitize(article.content)} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>

      {/* بخش کامنت‌ها */}
      <section className="mt-14">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">نظرات کاربران</h2>

        {/* لیست کامنت‌ها */}
        <div className="space-y-6">
          {article?.comments?.length > 0 ? (
            <Comments articleId={article.id} />
          ) : (
            <p className="text-gray-500">هنوز نظری ثبت نشده است.</p>
          )}
        </div>

        {/* فرم ارسال نظر */}
        <div className="mt-10">
          <CommentForm articleId={article.id} />
        </div>
      </section>
    </div>
  );
};

export default MainArticleContent;
