import { Message } from "@/types/common";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNotification } from "../../stores/notificationStore";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const getLocalData = <T = any>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);

    if (!raw || raw.trim() === "") return null; // ❗ بررسی رشته خالی

    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(
      `❌ Failed to parse localStorage data for key "${key}":`,
      error
    );
    return null;
  }
};

export const setLocalData = (key: string, value: any) => {
  try {
    const isSuccess = localStorage.setItem(key, JSON.stringify(value));
    return isSuccess;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export function normalizePhoneNumber(phone: string) {
  if (!phone) return phone;
  const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
  const englishNumbers = "0123456789";

  return phone.replace(
    /[۰-۹]/g,
    (d) => englishNumbers[persianNumbers.indexOf(d)]
  );
}

// فایل جداگانه یا در کامپوننت root
export async function fetchInitialNotificationCount() {
  try {
    useNotification.getState().setLoading(true);
    const response = await fetch("/api/dashboard/notifications");
    const result: any[] = await response.json();
    const unreadNotifications = result.filter((item) => !item.isRead);
    useNotification.getState().setNotificationCount(unreadNotifications.length);
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
  } finally {
    useNotification.getState().setLoading(false);
  }
}
