import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  const { message, title, userId } = await req.json();

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh,
          },
          expirationTime: null,
        },
        JSON.stringify({
          title,
          body: message,
          url: "/dashboard/notifications",
        })
      );
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // subscription منقضی یا نامعتبره، پس حذفش می‌کنیم
        await prisma.pushSubscription.delete({
          where: { endpoint: sub.endpoint },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            subscriptions: {
              deleteMany: {
                endpoint: sub.endpoint,
              },
            },
          },
        });
      } else {
        console.error("Push error", err);
      }
    }
  }

  return NextResponse.json({ success: true });
}
