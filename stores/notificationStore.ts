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
