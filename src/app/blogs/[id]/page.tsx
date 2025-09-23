import prisma from "@/lib/prisma";
import ArticlePage from "./components/ArticlePage";
import { Article, Comment } from "@/types/common";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BlogPage({ params }: Props) {
  const resolvedParams = await params;

  const id = resolvedParams?.id;

  if (id) {
    const article = await prisma.article.findUnique({
      where: { id },
    });

    return <ArticlePage data={article} />;
  }
}
