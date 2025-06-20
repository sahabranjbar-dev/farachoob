/*
  Warnings:

  - You are about to drop the column `name` on the `Role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[farsiTitle]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[englishTitle]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_name_key";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "name",
ADD COLUMN     "englishTitle" TEXT,
ADD COLUMN     "farsiTitle" TEXT,
ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Role_farsiTitle_key" ON "Role"("farsiTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Role_englishTitle_key" ON "Role"("englishTitle");
