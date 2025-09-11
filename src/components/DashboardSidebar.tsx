"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Role } from "@/types/dashboard";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import useTabular from "@/hooks/useTabular";
import MenuItem from "./MenuItem";
import { usePathname } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Props {
  user: {
    name: string;
    permissions?: string[];
    image?: string | null;
    role?: Role;
  };
}

export function DashboardSidebar({ user }: Props) {
  const {
    data: menuItems = [],
    isLoading,
    isValidating,
  } = useSWR("/api/dashboard/sidebarMenu", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const pathname = usePathname();
  const { open } = useTabular();
  const role = useSession().data?.user.role.englishTitle;

  const isRouteActive = (href: string) => pathname.includes(href);

  const renderMenuItem = (item: any, index: number) => {
    const IconComponent = (Icons as any)[item.icon] || Icons.Package;
    const isActive = isRouteActive(item.href);
    return (
      <MenuItem
        key={index}
        item={item}
        isActive={isActive}
        open={open}
        IconComponent={IconComponent}
      />
    );
  };

  return (
    <Sidebar className="bg-white dark:bg-gray-900 shadow-lg w-64 flex flex-col border-l">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-4 p-4">
          <Avatar className="w-12 h-12 ring-2 ring-orange-400">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="text-lg">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="font-bold text-lg truncate">{user.name}</span>
            {user.role?.farsiTitle && (
              <span className="text-xs text-muted-foreground capitalize mt-0.5 truncate">
                {user.role.farsiTitle}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="overflow-y-auto overflow-x-hidden flex-1 px-2 py-3">
        <SidebarGroup title="منو" className="text-gray-400 dark:text-gray-500">
          {/* Static dashboard link */}
          <Button
            variant="ghost"
            onClick={() => open("/", "داشبورد")}
            className={cn(
              "relative flex items-center gap-3 p-3 rounded-xl text-sm transition-all duration-200 w-full justify-start",
              pathname === `/dashboard/${role}`
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md hover:shadow-lg"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {pathname === `/dashboard/${role}` && (
              <motion.div
                layoutId="activeSidebarItem"
                className="absolute right-0 top-0 h-full w-1 rounded-r bg-orange-500 shadow-lg"
              />
            )}
            <Icons.Home size={20} />
            <span className="truncate font-medium">صفحه اصلی</span>
          </Button>

          {/* Dynamic menu */}
          {isLoading || isValidating ? (
            <div className="space-y-2 mt-4 px-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            menuItems.resultList?.map(renderMenuItem)
          )}
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-3">
        <Button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          variant="outline"
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-xl transition-all duration-200 w-full justify-start"
        >
          <LogOut size={20} />
          <span className="truncate">خروج</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
