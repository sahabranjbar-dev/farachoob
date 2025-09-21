import { create } from "zustand";
import { ISettingStates } from "./types/SettingStore";

export const useSetting = create<ISettingStates>((set, get) => ({
  userData: {},
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
