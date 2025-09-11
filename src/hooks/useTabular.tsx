"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useTransition, useCallback } from "react";
import { useTabStore } from "../../stores/tabStore";
import { useLoadingStore } from "../../stores/loadingStore";
import { useRouter } from "next/navigation";

export default function useTabular() {
  const {
    open: openTabInStore,
    closeAllTabs,
    closeCurrentTab,
    closeTab,
    tabs,
    activeTabId,
  } = useTabStore();

  const { startLoading, stopLoading } = useLoadingStore();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { data: session } = useSession();

  const role = session?.user?.role?.englishTitle;

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId),
    [tabs, activeTabId]
  );

  // Navigate on activeTab change
  useEffect(() => {
    if (!activeTab?.path || !role) return;

    const base = `/dashboard/${role}`;
    const target = `${base}/${activeTab.path}`;
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    if (currentPath !== target) {
      startTransition(() => {
        startLoading();
        router.replace(target);
        stopLoading(); // stopLoading بعد از replace
      });
    }
  }, [activeTab?.path, role, router, startLoading, stopLoading]);

  // Open tab function
  const open = useCallback(
    (path: string, title: string, queryParams?: Record<string, string>) => {
      if (!role) return;

      const queryString = queryParams
        ? "?" + new URLSearchParams(queryParams).toString()
        : "";

      const fullPath = `${path}${queryString}`;
      const fullDashboardPath = `/dashboard/${role}/${fullPath}`;
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";

      startTransition(() => {
        startLoading();
        openTabInStore(fullPath, title);

        if (currentPath !== fullDashboardPath) {
          router.push(fullDashboardPath);
        }

        stopLoading();
      });
    },
    [role, router, openTabInStore, startLoading, stopLoading]
  );

  return {
    tabs,
    activeTabId,
    open,
    closeTab,
    closeCurrentTab,
    closeAllTabs,
    activeTab,
    isPending,
  };
}
