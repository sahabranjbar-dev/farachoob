"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Armchair, FileUser, Home, PhoneOutgoing, Search } from "lucide-react";
import { Input } from "./ui/input";
import { ModeToggle } from "./ModeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import LoginAndRegister from "./LoginAndRegister";

const SideBar = () => {
  const t = useTranslations("SideBarHeader");
  const items = [
    {
      title: t("Home"),
      url: "/",
      icon: Home,
    },
    {
      title: t("Products"),
      url: "/products",
      icon: Armchair,
    },
    {
      title: t("Contact-us"),
      url: "/contact-us",
      icon: PhoneOutgoing,
    },
    {
      title: t("About-us"),
      url: "/about-us",
      icon: FileUser,
    },
  ];

  const pathname = usePathname();

  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar side="right" variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="relative">
          <Input
            type="text"
            placeholder={t("Search")}
            className="placeholder:font-light pl-8"
          />
          <Search className="absolute left-2 top-2" size={"18px"} />
        </div>
      </SidebarHeader>

      <div className="w-[95%]">
        <SidebarSeparator />
      </div>

      <SidebarContent className="p-2">
        <SidebarGroup>
          {/* <SidebarGroupLabel>فراچوب</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === pathname}
                    className="p-6"
                    onClick={() => setOpenMobile(false)}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span className="font-light">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="w-[95%]">
        <SidebarSeparator />
      </div>

      <SidebarFooter>
        <div className="flex justify-between items-center">
          <div>
            <ModeToggle />
            <LanguageSwitcher />
          </div>

          <div>
            <LoginAndRegister nameSpace="Header" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
