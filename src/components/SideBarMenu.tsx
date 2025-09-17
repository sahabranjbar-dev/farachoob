"use client";

import clsx from "clsx";
import {
  Blocks,
  FileUser,
  House,
  Newspaper,
  PhoneOutgoing,
  Sofa,
} from "lucide-react";
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
    { id: "home", title: "خانه", url: "/", icon: House },
    { id: "blogs", title: "مقالات", url: "/blogs", icon: Newspaper },
    {
      id: "contact",
      title: "تماس با ما",
      url: "/contact-us",
      icon: PhoneOutgoing,
    },
    { id: "about", title: "درباره ما", url: "/about-us", icon: FileUser },
    { id: "products", title: "محصولات", url: "/products", icon: Sofa },
    { id: "projects", title: "پروژه‌ها", url: "/projects", icon: Blocks },
  ];

  return (
    <>
      <SheetHeader>
        <SheetTitle></SheetTitle>
      </SheetHeader>

      <Separator />

      <div className="space-y-2 z-[100]">
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
