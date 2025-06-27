import { useRouter } from "@/i18n/navigation";
import { useTabStore } from "../../stores/tabStore";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";

export const usetabular = () => {
  const { open, closeAllTabs, closeCurrentTab, closeTab, tabs, activeTabId } =
    useTabStore();
  const router = useRouter();
  const { data } = useSession();
  const href = tabs.find((tab) => tab.id === activeTabId)?.path ?? "";

  const locale = useLocale();
  console.log(locale, "locale");

  return {
    closeCurrentTab: () => {
      router.back();
      closeCurrentTab();
    },
    open: (path: string, title: string) => {
      router.replace(`/dashboard/${data?.user.role}/${path}`, {
        locale,
      });
      open(path, title);
    },
    closeAllTabs,
    closeTab,
    activeTabId,
    tabs,
  };
};
