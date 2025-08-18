"use client";

import React, { useState } from "react";
import {
  LogIn,
  User,
  ChevronDown,
  XCircle,
  LayoutDashboardIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import LogoutButton from "./LogoutButton";

interface Props {
  nameSpace: string;
}

const LoginAndRegister = ({ nameSpace }: Props) => {
  const t = useTranslations(nameSpace);
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  // اسکلتون لودینگ قبل از بارگذاری سشن
  if (status === "loading") {
    return (
      <div className="w-32 h-10 bg-gray-300 animate-pulse rounded-lg"></div>
    );
  }

  if (session?.user) {
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-lg border cursor-pointer px-4 py-2 text-sm font-medium"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <User className="w-5 h-5" />
          <span>{session.user.name || session.user.email}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {open && (
          <div
            className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            role="menu"
          >
            <div className="py-1">
              <Link
                href="/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b flex justify-around items-center gap-2 text-center px-4 py-2 text-sm text-blue-700 hover:bg-orange-100 w-full"
              >
                <LayoutDashboardIcon />
                داشبورد
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
      className="flex justify-center items-center flex-row-reverse text-sm gap-2 cursor-pointer p-2 rounded-lg border hover:outline-1 transition-colors duration-300"
    >
      <LogIn className="rotate-180" size={20} />
      <span>{t("Login") + " / " + t("Register")}</span>
    </Link>
  );
};

export default LoginAndRegister;
