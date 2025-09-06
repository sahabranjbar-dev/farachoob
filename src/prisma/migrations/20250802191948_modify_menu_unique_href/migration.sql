/*
  Warnings:

  - A unique constraint covering the columns `[href]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Menu_href_key" ON "Menu"("href");
