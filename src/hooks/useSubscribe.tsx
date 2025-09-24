"use client";
import { useState } from "react";

interface Props {
  userId: string;
}

export default function useSubscribe() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  // بررسی پشتیبانی مرورگر از Push Notifications
  const isPushSupported = () => {
    return (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    );
  };

  const subscribe = async ({ userId }: Props) => {
    // بررسی پشتیبانی
    if (!isPushSupported()) {
      alert("مرورگر شما از نوتیفیکیشن پشتیبانی نمی‌کند!");
      return { error: "Browser not supported" };
    }

    // بررسی سیستم عامل - iOS پشتیبانی نمی‌کند
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      alert(
        "نوتیفیکیشن در iOS از طریق مرورگر قابل استفاده نیست. لطفاً از اپلیکیشن استفاده کنید."
      );
      return { error: "iOS not supported" };
    }

    try {
      const permission = await Notification.requestPermission((permission) => {
        console.log(permission);
      });
      if (permission !== "granted") {
        alert("اجازه نوتیفیکیشن داده نشد!");
        return { error: "Permission denied" };
      }

      const registration = await navigator.serviceWorker.ready;

      // بررسی وجود subscription قبلی
      let sub = await registration.pushManager.getSubscription();

      if (!sub) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        });
      }

      setSubscription(sub);

      // ارسال به سرور
      const response = await fetch(`/api/save-subscription?userId=${userId}`, {
        method: "POST",
        body: JSON.stringify(sub),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to save subscription");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error in subscription:", error);
      alert("خطا در فعال‌سازی نوتیفیکیشن!");
      return { error: "Subscription failed" };
    }
  };

  // تابع برای بررسی وضعیت subscription
  const checkSubscription = async () => {
    if (!isPushSupported()) return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      return await registration.pushManager.getSubscription();
    } catch (error) {
      return null;
    }
  };

  return {
    subscribe,
    setSubscription,
    subscription,
    isPushSupported,
    checkSubscription,
  };
}

// تبدیل base64 به Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
