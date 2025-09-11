"use client";

import clsx from "clsx";
import { Armchair, FileUser, Home, PhoneOutgoing } from "lucide-react";
import LoginAndRegister from "./LoginAndRegister";
import { ModeToggle } from "./ModeToggle";
import { Separator } from "./ui/separator";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const SideBarMenu = ({ setOpen }: Props) => {
  const pathname = usePathname();

  const items = [
    {
      title: "صفحه نخست",
      url: "/",
      icon: Home,
    },
    {
      title: "محصولات",
      url: "/products",
      icon: Armchair,
    },
    {
      title: "ارتباط با ما",
      url: "/contact-us",
      icon: PhoneOutgoing,
    },
    {
      title: "درباره ما",
      url: "/about-us",
      icon: FileUser,
    },
  ];

  return (
    <>
      <SheetHeader>
        <SheetTitle></SheetTitle>
      </SheetHeader>

      <Separator />

      <div className="space-y-2">
        {items.map((item, index) => (
          <Link
            key={item.title}
            href={item.url}
            className={clsx(
              "w-full flex items-center gap-2 justify-start px-6 py-6",
              {
                "bg-orange-400 text-white":
                  pathname === item.url || pathname.startsWith(item.url + "/"),
              }
            )}
            onClick={() => setOpen(false)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span className="font-light">{item.title}</span>
          </Link>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between items-center w-full p-2">
        <div className="flex justify-start items-center">
          <ModeToggle />
          {/* <LanguageSwitcher /> */}
        </div>
        <LoginAndRegister nameSpace="Header" />
      </div>
    </>
  );
};

export default SideBarMenu;
