"use client";

import { AlignJustify, Search, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import LoginAndRegister from "./LoginAndRegister";
import { ModeToggle } from "./ModeToggle";
import Navbar from "./Navbar";
import SideBarMenu from "./SideBarMenu";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { motion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";

const Header = () => {
  const t = useTranslations("Header");
  const pathname = usePathname();

  const isAuthPage = pathname?.startsWith("/auth");
  console.log(isAuthPage, "isss");
  if (isAuthPage) return;
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="sticky top-0 z-50 mt-4 shadow-md bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80"
    >
      {/* Top Header */}
      <div className="p-4 flex justify-between items-center bg-background">
        {/* Mobile Menu Sidebar */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <motion.div whileTap={{ scale: 0.9 }}>
                <AlignJustify size={24} />
              </motion.div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SideBarMenu />
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo & Toggles */}
        <div className="flex justify-between items-center gap-4">
          <Link href="/">
            <motion.div
              whileHover={{ rotate: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="cursor-pointer"
            >
              <Image
                alt="logo"
                src="/logo.webp"
                width={100}
                height={100}
                className="bg-orange-400 p-2 rounded-2xl dark:bg-transparent"
              />
            </motion.div>
          </Link>
          <div className="hidden md:flex justify-between items-center gap-4">
            <ModeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative hidden md:block">
          <Input
            type="text"
            placeholder={t("Search")}
            className="rounded placeholder:font-light pl-8 w-80 bg-[#EBEBEB] focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Search
            className="absolute left-2 top-2 text-gray-500"
            size={"18px"}
          />
        </div>

        {/* Login and Cart */}
        <div className="flex justify-between items-center gap-2">
          <div className="hidden md:flex justify-between items-center flex-row-reverse gap-4">
            <LoginAndRegister nameSpace="Header" />
          </div>

          {/* Cart Sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <motion.div whileTap={{ scale: 0.9 }}>
                <ShoppingCart size={24} />
              </motion.div>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <div className="py-4">
                <SheetTitle className="text-lg font-semibold absolute left-5 top-5">
                  {t("Your-cart", { name: "userName" })}
                </SheetTitle>
                {/* Your cart content here */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Navbar */}
      <Navbar />
    </motion.header>
  );
};

export default Header;
