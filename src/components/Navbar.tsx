"use client";

import {
  Armchair,
  Building2,
  CircleHelpIcon,
  FileUser,
  House,
  Newspaper,
  PhoneOutgoing,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "@/i18n/navigation";

const Navbar = () => {
  const t = useTranslations("Navbar");

  const items = useMemo(
    () => [
      { id: 1, title: t("Home"), url: "/", icon: House },
      { id: 2, title: t("Products"), url: "/products", icon: Armchair },
      { id: 3, title: t("Brands"), url: "/brands", icon: Building2 },
      { id: 4, title: t("Magazines"), url: "/magazines", icon: Newspaper },
      {
        id: 5,
        title: t("Contact-us"),
        url: "/contact-us",
        icon: PhoneOutgoing,
      },
      { id: 6, title: t("About-us"), url: "/about-us", icon: FileUser },
    ],
    [t]
  );
  return (
    <div className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList className="bg-white dark:bg-gray-800 flex flex-row-reverse">
          {items.map((item) => {
            return (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuLink asChild>
                  <div>
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 y-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-inherit"
                    >
                      <span className="text-lg font-normal text-gray-900 dark:text-gray-100">
                        {item.title}
                      </span>
                      <item.icon size={"20px"} />
                    </Link>
                  </div>
                </NavigationMenuLink>
                <NavigationMenuContent className="bg-white dark:bg-gray-800">
                  <ul>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="flex-row items-center gap-2">
                          <CircleHelpIcon />
                          Backlog
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="flex-row items-center gap-2">
                          <CircleHelpIcon />
                          Backlog
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="flex-row items-center gap-2">
                          <CircleHelpIcon />
                          Backlog
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="flex-row items-center gap-2">
                          <CircleHelpIcon />
                          Backlog
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
