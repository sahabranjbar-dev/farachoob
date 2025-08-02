import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { mobile, code } = req.body;

  const otp = await prisma.oTP.findFirst({
    where: {
      mobile,
      code,
      expiresAt: { gt: new Date() },
      verified: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return res.status(400).json({ message: "کد نامعتبر یا منقضی است" });
  }

  // علامت‌گذاری به عنوان استفاده‌شده
  await prisma.oTP.update({
    where: { id: otp.id },
    data: { verified: true },
  });

  // ساخت یا گرفتن یوزر
  const user = await prisma.user.upsert({
    where: { mobile },
    create: {
      mobile,
      roleId: "user-role-id", // نقش پیش‌فرض
    },
    update: {},
  });

  // ایجاد session با NextAuth به صورت دستی
  // در اینجا باید توکن JWT بسازی یا خودت سِشِن ست کنی، چون OTP provider نداری

  return res.status(200).json({ message: "ورود موفق", user });
}
