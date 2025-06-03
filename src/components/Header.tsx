"use client";

import { AlignJustify, LogIn, ShoppingCart } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import SideBar from "./SideBar";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import LoginAndRegister from "./LoginAndRegister";

const Header = () => {
  const t = useTranslations("Header");
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();
  return (
    <header className="sticky top-0">
      <div className="p-4 border flex justify-between items-center rounded-lg shadow-lg">
        <div className="md:hidden">
          <AlignJustify onClick={() => setOpenMobile(true)} />
          <SideBar />
          {/* <SidebarTrigger /> */}
        </div>

        <div className="flex justify-between items-center gap-4">
          <Link href="/">
            <Image
              alt="logo"
              src="/logo.webp"
              width={100}
              height={100}
              className="bg-primary p-2 rounded-2xl dark:bg-transparent"
            />
          </Link>
          <div className="hidden md:flex justify-between items-center gap-4">
            <div>
              <ModeToggle />
            </div>
            <div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2">
          <div className="hidden md:flex justify-between items-center flex-row-reverse gap-4 ">
            <LoginAndRegister nameSpace="Header" />
          </div>
          <Button variant="ghost" className="cursor-pointer">
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
