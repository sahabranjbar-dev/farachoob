"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import useSWR from "swr";
import { Role } from "@/types/dashboard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Props {
  user: {
    name: string;
    permissions: string[];
    image?: string | null;
    roles: Role[];
  };
}

export function DashboardSidebar({ user }: Props) {
  const pathname = usePathname();

  const { data: menuItems = [] } = useSWR("/api/dashboard/menus", fetcher);
  return (
    <Sidebar className="bg-gray-100 dark:bg-gray-900 border-l shadow-lg">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-4 p-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="text-lg">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-base">{user.name}</div>
          </div>
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup title="منو">
          {/* منو ثابت */}
          <Link
            href="/dashboard"
            className={cn(
              "relative flex items-center gap-3 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium",
              pathname === "/dashboard" &&
                "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
            )}
          >
            {pathname === "/dashboard" && (
              <motion.div
                layoutId="activeSidebarItem"
                className="absolute right-0 top-0 h-full w-1 bg-blue-500 rounded-r"
              />
            )}
            <Icons.Home size={20} />
            <span>صفحه اصلی</span>
          </Link>

          {/* منوهای داینامیک */}
          {menuItems.map((item: any) => {
            const isActive = pathname === item.href;
            const IconComponent = (Icons as any)[item.icon] || Icons.Package;

            return (
              <Link
                key={item.href}
                href={`/dashboard/${item.href}`}
                className={cn(
                  "relative flex items-center gap-3 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium",
                  isActive &&
                    "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarItem"
                    className="absolute right-0 top-0 h-full w-1 bg-blue-500 rounded-r"
                  />
                )}
                <IconComponent size={20} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex w-full items-center gap-2 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>خروج</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
