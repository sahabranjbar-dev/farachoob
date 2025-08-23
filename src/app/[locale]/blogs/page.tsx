// app/blogs/page.tsx
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  image: string;
}

// ISR → صفحه هر 1 ساعت دوباره ساخته میشه
export const revalidate = 3600;

// گرفتن داده‌ها از دیتابیس
async function getArticles(): Promise<BlogPost[]> {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: true },
  });

  return articles.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.content.slice(0, 150) + "...", // خلاصه محتوا
    slug: a.id, // اگر slug جدا نداریم، از id استفاده می‌کنیم
    date: a.publishedAt
      ? new Intl.DateTimeFormat("fa-IR").format(a.publishedAt)
      : "",
    image: a.coverImage || "/desk.jpg",
  }));
}

export default async function Blogs() {
  const blogPosts = await getArticles();

  return (
    <>
      {/* هیرو بخش */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-500 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
            بلاگ تخصصی مبلمان اداری
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-blue-100">
            جدیدترین مقالات و راهنمای‌های تخصصی در زمینه طراحی محیط کار و انتخاب
            مبلمان اداری
          </p>
        </div>
      </section>

      {/* بخش اصلی */}
      <main className="container mx-auto px-6 py-16">
        {/* لیست مقالات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-100"
            >
              <div className="h-52 relative overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col justify-between h-56">
                <div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={14} /> {post.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center text-blue-600 font-semibold mt-4 hover:text-blue-800 transition-colors"
                >
                  مطالعه مقاله
                  <ArrowRight size={16} className="mr-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* پینوشت */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-4">
            دانش تخصصی برای محیط‌های کاری بهتر
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            در بلاگ تخصصی ما، شما با جدیدترین استانداردهای طراحی محیط کار،
            ارگونومی مبلمان اداری و راهکارهای بهینه‌سازی فضای کاری آشنا می‌شوید.
          </p>
        </div>
      </main>
    </>
  );
}
