-- CreateEnum
CREATE TYPE "public"."ThemeColorScheme" AS ENUM ('auto', 'dark', 'light');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "browserNotification" BOOLEAN,
ADD COLUMN     "emailNotification" BOOLEAN,
ADD COLUMN     "profileVisible" BOOLEAN,
ADD COLUMN     "searchVisible" BOOLEAN,
ADD COLUMN     "smsNotification" BOOLEAN,
ADD COLUMN     "theme" "public"."ThemeColorScheme";
