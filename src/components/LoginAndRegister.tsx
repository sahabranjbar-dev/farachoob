"use client";

import React, { useState, useRef, useEffect } from "react";
import { LogIn, User, ChevronDown, LayoutDashboardIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Props {
  nameSpace: string;
}

const LoginAndRegister = ({ nameSpace }: Props) => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="w-32 h-10 bg-gray-300 animate-pulse rounded-lg"></div>
    );
  }

  if (session?.user) {
    return (
      <div ref={ref} className="relative inline-block text-left">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="flex items-center gap-2 rounded-lg border cursor-pointer px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <User className="w-5 h-5" />
          <span className="truncate max-w-[120px]">
            {session.user.name || "کاربر میهمان"}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div
            className="absolute left-5 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            role="menu"
          >
            <div className="py-1 flex flex-col">
              <Link
                href="/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-around items-center gap-2 px-4 py-2 text-sm text-blue-700 hover:bg-orange-100 rounded-md transition-colors"
              >
                <LayoutDashboardIcon />
                <span className="max-w-8 min-w-10 w-10 text-nowrap">
                  پنل کاربری
                </span>
              </Link>
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    );
  }

  // اگر کاربر لاگین نکرده
  return (
    <Link
      href={`/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`}
      className="flex justify-center items-center flex-row-reverse text-sm gap-2 cursor-pointer px-3 py-2 rounded-lg border hover:bg-gray-100 transition-colors"
    >
      <LogIn className="rotate-180" size={20} />
      <span>{`ورود / ثبت نام`}</span>
    </Link>
  );
};

export default LoginAndRegister;
