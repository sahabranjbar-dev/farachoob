// utils/getCommentsRecursive.ts
import prisma from "@/lib/prisma";
import { Comment } from "@/types/common";

export async function getCommentsRecursive(
  parentId: string | null,
  articleId: string
): Promise<Comment[]> {
  const comments = await prisma.comment.findMany({
    where: { parentId, articleId },
    include: {
      user: true,
      likes: true,
      replies: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(
    comments.map(async (comment) => ({
      ...comment,
      replies: await getCommentsRecursive(comment.id, articleId),
    }))
  );
}
