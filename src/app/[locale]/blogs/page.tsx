import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export const revalidate = 3600;

async function getArticles(): Promise<BlogPost[]> {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: true },
  });

  return articles.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.content.slice(0, 150) + "...",
    date: a.publishedAt
      ? new Intl.DateTimeFormat("fa-IR").format(a.publishedAt)
      : "",
    image: a.coverImage || "/desk.jpg",
  }));
}

export default async function Blogs() {
  const blogPosts = await getArticles();
  console.log({ blogPosts });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Elegant Design */}
      <section className="relative py-14 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #4F46E5 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        <div className="container relative mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 mx-auto mb-6"></div>
            <h1 className="text-4xl sm:text-5xl font-medium text-gray-800 mb-6 tracking-tight leading-tight">
              مقالات سایت فراچوب
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] border border-gray-100 shadow-sm hover:shadow-md"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: "center" }}
                />
                <div className="absolute top-4 left-4 bg-white/90 text-gray-600 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
                  <CalendarDays size={12} />
                  <span>{post.date}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-800 mb-3 leading-relaxed group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h3>

                <Link
                  href={`/blogs/${post.id}`}
                  className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors group/btn font-medium"
                >
                  <span className="border-b border-transparent group-hover/btn:border-gray-300 transition-all">
                    مطالعه مقاله
                  </span>
                  <ArrowRight
                    size={14}
                    className="mt-0.5 transition-transform group-hover/btn:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Subtle Footer */}
        <div className="mt-32 text-center px-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8"></div>
          <h3 className="text-xl font-light text-gray-600 mb-4">
            طراحی محیط کار برای بهره‌وری و آسایش
          </h3>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-6">
            هر مقاله با دقت و توجه به جزئیات تهیه شده تا بینش عمیقی در مورد
            طراحی فضای کاری مدرن ارائه دهد.
          </p>
        </div>
      </main>
    </div>
  );
}
