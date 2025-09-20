"use client";
import { useState } from "react";

export default function useSubscribe() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  const subscribe = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("اجازه نوتیفیکیشن داده نشد!");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    setSubscription(sub);

    // ارسال به سرور
    await fetch("/api/save-subscription", {
      method: "POST",
      body: JSON.stringify(sub),
      headers: { "Content-Type": "application/json" },
    });

    alert("عضویت در نوتیفیکیشن‌ها با موفقیت انجام شد ✅");
  };

  return {
    subscribe,
    setSubscription,
    subscription,
  };
}

// تبدیل base64 به Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
