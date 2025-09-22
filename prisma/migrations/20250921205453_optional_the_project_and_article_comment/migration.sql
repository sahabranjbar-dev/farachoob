-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."Comment" ALTER COLUMN "articleId" DROP NOT NULL,
ALTER COLUMN "projectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
