"use client";

import { Bell, Sun, Moon, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";

type Props = {
  user: { name: string; avatarUrl?: string };
};

export default function DashboardHeader({ user }: Props) {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 shadow-md sticky top-0 z-50">
      {/* لوگو */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/")}>
          بازگشت به سایت
        </Button>
      </div>

      {/* آیکون‌ها */}
      <div className="flex items-center gap-6">
        {/* اعلان‌ها */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-600 text-white text-xs rounded-full">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>اعلان‌ها</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>سفارش جدید ثبت شد</DropdownMenuItem>
            <DropdownMenuItem>کاربر جدید ثبت‌نام کرد</DropdownMenuItem>
            <DropdownMenuItem>درخواست پشتیبانی دریافت شد</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* تغییر تم */}
        <ModeToggle />

        {/* پروفایل */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6" />
              )}
              <span className="hidden sm:block font-semibold">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>پروفایل</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>تنظیمات</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/auth/logout")}>
              <LogOut className="mr-2 h-4 w-4 text-red-600" />
              <span className="text-red-600">خروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
