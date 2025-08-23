"use client";

import React, { useState, useRef, useEffect } from "react";
import { LogIn, User, ChevronDown, LayoutDashboardIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import LogoutButton from "./LogoutButton";

interface Props {
  nameSpace: string;
}

const LoginAndRegister = ({ nameSpace }: Props) => {
  const t = useTranslations(nameSpace);
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
          className="flex items-center gap-2 rounded-lg border cursor-pointer px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <User className="w-5 h-5" />
          <span className="truncate max-w-[120px]">
            {session.user.name || session.user.email}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
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
                <span className="max-w-8 min-w-10 w-10">داشبورد</span>
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
      href="/auth/login"
      className="flex justify-center items-center flex-row-reverse text-sm gap-2 cursor-pointer px-3 py-2 rounded-lg border hover:bg-gray-100 transition-colors"
    >
      <LogIn className="rotate-180" size={20} />
      <span>{t("Login") + " / " + t("Register")}</span>
    </Link>
  );
};

export default LoginAndRegister;
