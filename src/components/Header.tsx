"use client";

import { AlignJustify, Search, ShoppingCart } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import LoginAndRegister from "./LoginAndRegister";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import SideBarMenu from "./SideBarMenu";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import Navbar from "./Navbar";

const Header = () => {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-50 mt-4 shadow-md bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Top Header */}
      <div className="p-4 flex justify-between items-center bg-background">
        {/* Mobile Menu Sidebar */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <AlignJustify className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SideBarMenu />
            </SheetContent>
          </Sheet>
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
            <ModeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        <div className="relative hidden md:block">
          <Input
            type="text"
            placeholder={t("Search")}
            className="rounded placeholder:font-light pl-8 w-80 bg-[#EBEBEB]"
          />
          <Search className="absolute left-2 top-2" size={"18px"} />
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="hidden md:flex justify-between items-center flex-row-reverse gap-4">
            <LoginAndRegister nameSpace="Header" />
          </div>

          {/* Cart Sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">{t("Cart")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <div className="py-4">
                <SheetTitle className="text-lg font-semibold absolute left-5 top-5">
                  {t("Your-cart", { name: "یوزر" })}
                </SheetTitle>
                {/* Your cart content here */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Navbar />
    </header>
  );
};

export default Header;
