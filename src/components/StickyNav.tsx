"use client";

import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Home, Layers2, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const StickyNav = () => {
  const t = useTranslations("StickyNav");

  const pathname = usePathname();

  const items = [
    {
      title: t("Home"),
      url: "/",
      icon: Home,
    },
    {
      title: t("Category"),
      url: "/category",
      icon: Layers2,
    },
    {
      title: t("Cart"),
      url: "/cart",
      icon: ShoppingCart,
    },
    {
      title: t("Profile"),
      url: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 right-0 w-full bg-white border-t shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-end p-2 h-16 my-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex-1 flex flex-col items-center relative"
          >
            <Link
              href={item.url}
              className={cn(
                "flex flex-col items-center justify-center w-full pb-1",
                "transition-all duration-200"
              )}
            >
              <div
                className={cn("p-2 rounded-full", {
                  "bg-primary/10 text-primary": item.url === pathname,
                  "text-muted-foreground": item.url !== pathname,
                })}
              >
                <item.icon
                  size="20px"
                  className={cn({
                    "font-bold": item.url === pathname,
                  })}
                />
              </div>
              <span
                className={cn("text-xs", {
                  "font-bold text-primary": item.url === pathname,
                  "text-muted-foreground": item.url !== pathname,
                })}
              >
                {item.title}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickyNav;
