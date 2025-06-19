"use client";

import React, { useState } from "react";
import { LogIn, User, ChevronDown, XCircle } from "lucide-react";
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
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
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
      className="flex justify-center items-center flex-row-reverse border cursor-pointer p-2 rounded-lg hover:bg-gray-300 transition-colors duration-300"
    >
      <LogIn className="rotate-180" />
      <span>{t("Login") + " / " + t("Register")}</span>
    </Link>
  );
};

export default LoginAndRegister;
