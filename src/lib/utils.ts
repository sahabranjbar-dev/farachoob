import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
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
