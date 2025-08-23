// app/blogs/[id]/page.tsx
import prisma from "@/lib/prisma";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import CommentForm from "../components/CommentForm";
import BestSellingProducts from "../components/BestSellingProducts";
import Comments from "@/components/Comments/Comments";

interface BlogPageProps {
  params: { id: string };
}

export const revalidate = 3600;

export default async function BlogPage({ params }: BlogPageProps) {
  const article = await prisma.article.findUnique({
    where: {
      id: params?.id,
    },
    include: {
      author: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
  if (!article) return notFound();

  // ضدعفونی کردن محتوا
  const safeContent = DOMPurify.sanitize(article.content);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* بخش اصلی مقاله */}
        <div className="lg:col-span-3">
          {/* تصویر مقاله */}
          <div className="relative h-56 sm:h-72 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={article.coverImage || "/images/placeholder.png"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* عنوان و محتوا */}
          <div className="mt-6 border p-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">
              {article.title}
            </h1>
            <div className="flex justify-end items-center gap-2 text-gray-500 text-xs sm:text-sm mb-6">
              <span>
                آخرین ویرایش: {article.updatedAt.toLocaleDateString("fa")}
              </span>
              <CalendarDays size={16} />
            </div>

            <article
              className="prose prose-sm sm:prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </div>

          {/* بخش کامنت‌ها */}
          <section className="mt-14">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              نظرات کاربران
            </h2>

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

        {/* سایدبار */}
        <aside className="lg:col-span-2">
          <div className="border rounded-2xl shadow-lg p-4 sticky top-28">
            <h3 className="font-bold text-gray-700 mb-4">محصولات پرفروش</h3>
            <BestSellingProducts />
          </div>
        </aside>
      </div>
    </main>
  );
}
