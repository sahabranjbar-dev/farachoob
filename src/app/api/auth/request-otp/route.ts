import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { sendSms } from "@/lib/sms"; // این تابع باید پیامک را ارسال کند
import { NextResponse } from "next/server";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { mobile } = req.body;

  if (!mobile) return res.status(400).json({ error: "شماره وارد نشده است" });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 رقمی

  return NextResponse.json({ code });
}
