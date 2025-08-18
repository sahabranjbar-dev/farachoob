import { PrismaClient } from "@/generated/prisma";

declare global {
  // جلوگیری از multi-instance در حالت hot-reload
  var prisma: PrismaClient | undefined;
}

// اگر قبلاً instance وجود دارد از آن استفاده کن، در غیر این صورت یک instance جدید بساز
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // می‌تونی لاگ‌ها را فعال کنی
  });

// فقط در محیط development، instance را روی global نگه دار
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
// در صورت نیاز می‌توانی اینجا توابع کمکی برای کار با Prisma اضافه کنی
export default prisma;
export { PrismaClient } from "@/generated/prisma"; // برای دسترسی به نوع PrismaClient
export type { Prisma } from "@/generated/prisma"; // برای دسترسی به انواع Prisma
