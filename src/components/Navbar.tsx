"use client";

import {
  Armchair,
  Building2,
  FileUser,
  House,
  Newspaper,
  PhoneOutgoing,
  Sofa,
  Table,
  LampDesk,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [productsOpen, setProductsOpen] = useState(false);

  const items = useMemo(
    () => [
      { id: "home", title: t("Home"), url: "/", icon: House },
      {
        id: "products",
        title: t("Products"),
        url: "/products",
        icon: Armchair,
      },
      {
        id: "representatives",
        title: t("Representatives"),
        url: "/representatives",
        icon: Building2,
      },
      { id: "blogs", title: t("Blogs"), url: "/blogs", icon: Newspaper },
      {
        id: "contact",
        title: t("Contact-us"),
        url: "/contact-us",
        icon: PhoneOutgoing,
      },
      { id: "about", title: t("About-us"), url: "/about-us", icon: FileUser },
    ],
    [t]
  );

  const productCategories = [
    {
      id: 1,
      name: "مبلمان اداری",
      icon: Sofa,
      url: "/products?category=office",
    },
    {
      id: 2,
      name: "میز مدیریتی",
      icon: Table,
      url: "/products?category=executive",
    },
    {
      id: 3,
      name: "صندلی کارمندی",
      icon: Armchair,
      url: "/products?category=chairs",
    },
    {
      id: 4,
      name: "میز کنفرانس",
      icon: LampDesk,
      url: "/products?category=conference",
    },
  ];

  return (
    <nav className="hidden md:flex justify-center py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-8 relative">
        {items.map((item) => {
          const isActive = pathname === item.url;
          const isHovered = hoveredItem === item.id;
          const Icon = item.icon;

          if (item.id === "products") {
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => {
                  setHoveredItem(item.id);
                  setProductsOpen(true);
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setProductsOpen(false);
                }}
              >
                <button
                  className={cn(
                    "flex items-center gap-2 px-1 py-2 text-base font-medium transition-colors relative",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.title}</span>
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300",
                      isActive || isHovered ? "w-full" : "w-0"
                    )}
                  />
                </button>

                {/* Products Dropdown */}
                {productsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-2">
                      {productCategories.map((category) => {
                        const CategoryIcon = category.icon;
                        return (
                          <Link
                            key={category.id}
                            href={category.url}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                              "hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
                            )}
                            onMouseEnter={() => setHoveredItem(item.id)}
                          >
                            <CategoryIcon className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                            <span>{category.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.url}
              className={cn(
                "flex items-center gap-2 px-1 py-2 text-base font-medium transition-colors relative",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              )}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.title}</span>
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300",
                  isActive || isHovered ? "w-full" : "w-0"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
