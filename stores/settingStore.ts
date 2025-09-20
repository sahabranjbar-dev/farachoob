import { create } from "zustand";
import { ISettingStates } from "./types/SettingStore";

export const useSetting = create<ISettingStates>((set, get) => ({
  userData: {
    biography: "",
    email: "",
    firstName: "",
    image: "",
    isActive: false,
    isVerified: false,
    lastName: "",
    location: "",
    notification: {
      email: false,
      pushNotification: false,
      sms: false,
    },
    phone: "",
    privacy: {
      profileVisible: true,
      searchVisible: true,
    },
  },
  loading: false,
  setLoading(loading) {
    set({ loading });
  },
  //ACTIONS
  setUserData(userData) {
    if (typeof userData === "function") {
      set((state) => ({ userData: userData(state.userData) }));
    } else {
      set({ userData });
    }
  },
}));
