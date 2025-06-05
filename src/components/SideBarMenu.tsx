"use client";

import { Armchair, FileUser, Home, PhoneOutgoing, Search } from "lucide-react";
import { Input } from "./ui/input";
import { ModeToggle } from "./ModeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import LoginAndRegister from "./LoginAndRegister";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const SideBarMenu = () => {
  const t = useTranslations("SideBarHeader");
  const pathname = usePathname();

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

  return (
    <>
      <SheetHeader>
        <SheetTitle className="">
          {/* {t("Menu")} */}
          <div className="relative mt-8">
            <Input
              type="text"
              placeholder={t("Search")}
              className="rounded placeholder:font-light pl-8 bg-[#EBEBEB]"
            />
            <Search className="absolute left-2 top-2" size={"18px"} />
          </div>
        </SheetTitle>
      </SheetHeader>

      <Separator />

      <div className="space-y-2">
        {items.map((item) => (
          <Button
            key={item.title}
            asChild
            variant={item.url === pathname ? "secondary" : "ghost"}
            className="w-full justify-start px-6 py-6"
          >
            <Link href={item.url}>
              <item.icon className="mr-2 h-4 w-4" />
              <span className="font-light">{item.title}</span>
            </Link>
          </Button>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between items-center w-full p-2">
        <div className="flex justify-start items-center">
          <ModeToggle />
          <LanguageSwitcher />
        </div>
        <LoginAndRegister nameSpace="Header" />
      </div>
    </>
  );
};

export default SideBarMenu;
