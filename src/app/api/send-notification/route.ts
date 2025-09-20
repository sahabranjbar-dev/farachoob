import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { getSubscriptions } from "../save-subscription/route";

webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const subscriptions = getSubscriptions();
  console.log("All subscriptions:", getSubscriptions());

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        sub,
        JSON.stringify({
          title: "پیام جدید",
          body: message,
          url: "/dashboard/notifications",
        })
      );
      console.log("Notification sent to:", sub);
    } catch (err) {
      console.error("Push error", err);
    }
  }

  return NextResponse.json({ success: true });
}
