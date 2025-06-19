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
import { Home, UserCog, Package, ClipboardList, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Role } from "@/types/dashboard";
import { motion } from "framer-motion";

interface Props {
  user: { name: string; role: Role[]; image?: string | null };
}

const roleLabels: Record<Role, string> = {
  ADMIN: "مدیر کل",
  MANAGER: "مدیر",
  AGENT: "نماینده",
  CUSTOMER: "مشتری",
};

export function DashboardSidebar({ user }: Props) {
  const pathname = usePathname();

  const menuItems = [
    { label: "صفحه اصلی", href: "/dashboard", icon: Home },
    ...(user?.role?.includes("ADMIN")
      ? [
          {
            label: "مدیریت کاربران",
            href: "/dashboard/admin/users",
            icon: UserCog,
          },
          {
            label: "مدیریت محصولات",
            href: "/dashboard/admin/products",
            icon: Package,
          },
        ]
      : user?.role?.includes("MANAGER")
      ? [
          {
            label: "مدیریت سفارشات",
            href: "/dashboard/manager/orders",
            icon: ClipboardList,
          },
          {
            label: "مدیریت کاربران",
            href: "/dashboard/manager/users",
            icon: ClipboardList,
          },
        ]
      : user?.role?.includes("AGENT")
      ? [
          {
            label: "سفارشات من",
            href: "/dashboard/agent/orders",
            icon: ClipboardList,
          },
        ]
      : [
          {
            label: "سفارشات من",
            href: "/dashboard/customer/orders",
            icon: ClipboardList,
          },
        ]),
  ];

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
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {user.role.map((r) => roleLabels[r]).join("، ")}
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup title="منو">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
                <item.icon size={20} />
                <span>{item.label}</span>
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
