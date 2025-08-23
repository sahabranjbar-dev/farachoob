import React from "react";
import BlogsForm from "../components/BlogsForm";
import { prisma } from "@/lib/prisma";

interface IBlogsFormPageProps {
  searchParams: Promise<{ pageType: string; id: string }>;
}
const BlogsFormPage = async ({ searchParams }: IBlogsFormPageProps) => {
  const reasolvedSearchParams = await searchParams;
  const { id } = reasolvedSearchParams;

  let sanitizedArticle:
    | {
        id?: string;
        title?: string;
        coverImage?: string;
        published?: boolean;
        content?: string;
      }
    | undefined = undefined;

  if (id) {
    try {
      const article = await prisma.article.findUnique({
        where: { id },
      });

      if (article) {
        sanitizedArticle = {
          id: article.id,
          title: article.title || "",
          coverImage: article.coverImage || "",
          published: article.published ?? false,
          content: article.content || "",
        };
      }
    } catch (error) {
      console.error("خطا در دریافت مقاله:", error);
    }
  }

  return <BlogsForm initialData={sanitizedArticle} />;
};

export default BlogsFormPage;
