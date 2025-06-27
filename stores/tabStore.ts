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
  open: (path: string, title: string, params?: any) => void;
  closeTab: (id: string) => void;
  closeCurrentTab: () => void;
  closeAllTabs: () => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: "",
      open: (path, title, params = {}) => {
        const query = new URLSearchParams(params).toString();
        const fullPath = query ? `${path}?${query}` : path;

        const existing = get().tabs.find((t) => t.path === fullPath);
        if (existing) {
          set({ activeTabId: existing.id });
          return;
        }

        const newTab: Tab = {
          id: crypto.randomUUID(),
          path: fullPath,
          title,
          parentId: get().activeTabId,
        };

        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id,
        }));
      },

      closeTab: (id) => {
        set((state) => {
          const closingTab = state.tabs.find((t) => t.id === id);
          const remainingTabs = state.tabs.filter((t) => t.id !== id);

          let nextActiveTabId = state.activeTabId;

          if (state.activeTabId === id) {
            // تب فعال فعلی بسته شده
            const parentExists =
              closingTab?.parentId &&
              remainingTabs.some((t) => t.id === closingTab.parentId);

            if (parentExists) {
              nextActiveTabId = closingTab?.parentId!;
            } else {
              nextActiveTabId = remainingTabs.at(-1)?.id ?? "";
            }
          }

          return {
            tabs: remainingTabs,
            activeTabId: nextActiveTabId,
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
