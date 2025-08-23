import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  publishedAt?: any;
  createdAt?: string;
  updatedAt?: string;
  authorId?: string;
  author?: Author;
  comments?: any[];
}

export interface Author {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  nationalId?: any;
  birthDate?: any;
  mobile?: string;
  isActive?: boolean;
  isVerified?: boolean;
  image?: any;
  roleId?: string;
  createdAt?: string;
}

export const revalidate = 3600;

export default async function Blogs() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: true, comments: true },
  });
  console.log({ articles });

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
          {articles.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] border border-gray-100 shadow-sm hover:shadow-md"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={post.coverImage || "/images/placeholder.png"}
                  alt={post?.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: "center" }}
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute top-4 left-4 flex items-center rounded-lg bg-white/90 px-3 py-1.5 text-xs text-gray-600 shadow-sm backdrop-blur-sm group">
                      <CalendarDays size={14} className="cursor-pointer" />
                      <div
                        className={cn(
                          "flex justify-between items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out",
                          "max-w-0 group-hover:max-w-[9rem]"
                        )}
                      >
                        <span className="mr-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                          {post?.updatedAt.toLocaleDateString("fa")}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>تاریخ آخرین ویرایش</TooltipContent>
                </Tooltip>
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
