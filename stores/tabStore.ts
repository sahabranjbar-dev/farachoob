import { useRouter } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Tab {
  id: string;
  parentId?: string;
  path: string;
  title: string;
}

export interface TabState {
  tabs: Tab[];
  activeTabId: string;
  open: (path: string, title: string) => void;
  closeTab: (id: string) => void;
  closeCurrentTab: () => void;
  closeAllTabs: () => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: "",
      open: (path, title) => {
        set((state) => {
          const existing = state.tabs.find((t) => t.path === path);
          if (existing) {
            return { ...state, activeTabId: existing.id };
          }

          const newTab: Tab = {
            id: crypto.randomUUID(),
            path,
            title,
            parentId: state.activeTabId, // ✅ استفاده امن
          };

          return {
            tabs: [...state.tabs, newTab],
            activeTabId: newTab.id,
          };
        });
      },
      closeTab: (id) => {
        set((state) => {
          const tab = state.tabs.find((t) => t.id === id);
          const tabs = state.tabs.filter((t) => t.id !== id);
          const isActive = state.activeTabId === id;

          return {
            tabs,
            activeTabId: isActive
              ? tab?.parentId ?? tabs.at(-1)?.id
              : get().activeTabId,
          };
        });
      },
      closeCurrentTab: () => {
        const id = get().activeTabId;
        get().closeTab(id);
      },
      closeAllTabs: () => {
        set({ tabs: [], activeTabId: "" });
      },
    }),
    {
      name: "tab-storage", // for localStorage
    }
  )
);
