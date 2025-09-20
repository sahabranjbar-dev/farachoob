import { create } from "zustand";
import { INotificationStates } from "./types/NotificationStore";

export const useNotification = create<INotificationStates>((set) => ({
  notificationCount: 0, // مقدار اولیه صفر
  loading: false,
  addNewNotification() {
    set((state) => ({ notificationCount: state.notificationCount + 1 }));
  },
  setNotificationCount(count: number) {
    set({ notificationCount: count });
  },
  setLoading(loading) {
    set({ loading });
  },
}));

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
