"use client";

import { useRouter } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useTransition } from "react";
import { useTabStore } from "../../stores/tabStore";
import { useLoadingStore } from "../../stores/loadingStore";

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
  const locale = useLocale();

  const role = session?.user?.role;

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId),
    [tabs, activeTabId]
  );

  useEffect(() => {
    const base = `/dashboard/${role}`;
    const target = activeTab?.path ? `${base}/${activeTab.path}` : base;

    startTransition(() => {
      startLoading();
      router.replace(target);
      stopLoading();
    });
  }, [activeTabId, role, locale]);

  const open = (
    path: string,
    title: string,
    queryParams?: Record<string, string>
  ) => {
    const queryString = queryParams
      ? "?" + new URLSearchParams(queryParams).toString()
      : "";

    const fullPath = `${path}${queryString}`;
    const fullDashboardPath = `/dashboard/${role}/${fullPath}`;

    startTransition(() => {
      startLoading();
      openTabInStore(fullPath, title);
      router.push(fullDashboardPath);
      stopLoading();
    });
  };

  return {
    tabs,
    activeTabId,
    open,
    closeTab,
    closeCurrentTab,
    closeAllTabs,
    isPending,
  };
}
