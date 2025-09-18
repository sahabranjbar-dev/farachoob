/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PermissionKey" ADD VALUE 'can_export';
ALTER TYPE "public"."PermissionKey" ADD VALUE 'can_import';
ALTER TYPE "public"."PermissionKey" ADD VALUE 'view_chat';
ALTER TYPE "public"."PermissionKey" ADD VALUE 'create_chat';
ALTER TYPE "public"."PermissionKey" ADD VALUE 'edit_chat';
ALTER TYPE "public"."PermissionKey" ADD VALUE 'delete_chat';

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "tempId" TEXT;

-- DropTable
DROP TABLE "public"."Session";

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
