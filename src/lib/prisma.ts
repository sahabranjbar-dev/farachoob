import { PrismaClient } from "@/generated/prisma";

declare global {
  // جلوگیری از multi-instance در حالت hot-reload
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
