"use client";

import { motion } from "framer-motion";
import { AlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LoginAndRegister from "./LoginAndRegister";
import { ModeToggle } from "./ModeToggle";
import Navbar from "./Navbar";
import SideBarMenu from "./SideBarMenu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAuthPage =
    pathname?.startsWith("/auth") || pathname?.startsWith("/dashboard");
  if (isAuthPage) return;
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="sticky top-0 z-50 shadow-md bg-white dark:bg-black"
    >
      {/* Top Header */}
      <div className="p-4 flex justify-between items-center bg-transparent">
        {/* Mobile Menu Sidebar */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <motion.div whileTap={{ scale: 0.9 }}>
                <AlignJustify size={24} />
              </motion.div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SideBarMenu setOpen={setOpen} key="sidebarmenu" />
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
                width={70}
                height={70}
                className="bg-orange-500 p-2 rounded-2xl dark:bg-transparent"
                unoptimized
              />
            </motion.div>
          </Link>
          <div className="hidden md:flex justify-between items-center gap-4">
            <ModeToggle />
            {/* <LanguageSwitcher /> */}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative hidden md:block">
          {/* <Input
            type="text"
            placeholder={t("Search")}
            className="rounded placeholder:font-light pl-8 w-80 bg-[#EBEBEB] focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Search
            className="absolute left-2 top-2 text-gray-500"
            size={"18px"}
          /> */}
          <Navbar />
        </div>

        {/* Login and Cart */}
        <div className="flex flex-row-reverse justify-between items-center gap-2">
          <div className="hidden md:flex justify-between items-center flex-row-reverse gap-4">
            <LoginAndRegister nameSpace="Header" />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
