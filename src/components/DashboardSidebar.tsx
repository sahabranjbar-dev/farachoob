"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "@/i18n/navigation";
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Props {
  user: {
    name: string;
    permissions?: string[];
    image?: string | null;
    roles?: Role;
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
  const role = useSession().data?.user.role;

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
    <Sidebar className="bg-white dark:bg-gray-900 border-l shadow-md">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-4 p-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="text-lg">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-base">{user.name}</span>
            {user.roles && (
              <span className="text-xs text-muted-foreground capitalize mt-0.5">
                {user.roles}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup title="منو">
          {/* Static dashboard link */}
          <Button
            variant="ghost"
            onClick={() => open("/", "داشبورد")}
            className={cn(
              "relative flex items-center gap-3 p-3 rounded-lg text-sm transition-colors",
              pathname === `/dashboard/${role}`
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {pathname === `/dashboard/${role}` && (
              <motion.div
                layoutId="activeSidebarItem"
                className="absolute right-0 top-0 h-full w-1 bg-blue-500 rounded-r"
              />
            )}
            <Icons.Home size={20} />
            <span>صفحه اصلی</span>
          </Button>

          {/* Dynamic menu */}
          {isLoading || isValidating ? (
            <div className="space-y-2 mt-2 px-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            menuItems.resultList?.map(renderMenuItem)
          )}
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex w-full items-center gap-2 p-3 rounded-md text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
        >
          <LogOut size={18} />
          <span>خروج</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
