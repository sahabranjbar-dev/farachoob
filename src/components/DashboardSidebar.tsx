"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { usetabular } from "@/hooks/useTabular";
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

  const session = useSession();
  const pathname = usePathname();
  const role = session.data?.user.role;
  const router = useRouter();

  const { open } = usetabular();
  return (
    <Sidebar className="bg-gray-100 dark:bg-gray-900 border-l shadow-lg">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-4 p-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className="text-lg">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-base">{user?.name}</div>
          </div>
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup title="منو">
          {/* منو ثابت */}
          <Button
            onClick={() => {
              open("/", "داشبورد");
            }}
            variant={"ghost"}
            className={cn(
              "relative flex items-center gap-3 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium",
              pathname === `/dashboard/${role}` &&
                "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
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

          {/* منوهای داینامیک */}
          {isValidating || isLoading ? (
            <div>
              <Skeleton className="w-[90%] h-8 m-2 p-2" />
              <Skeleton className="w-[90%] h-8 m-2 p-2" />
              <Skeleton className="w-[90%] h-8 m-2 p-2" />
              <Skeleton className="w-[90%] h-8 m-2 p-2" />
            </div>
          ) : (
            menuItems.resultList?.map((item: any, index: number) => {
              const isActive = pathname.includes(item.href);
              const IconComponent = (Icons as any)[item.icon] || Icons.Package;

              return (
                <Button
                  key={index}
                  // href={`/dashboard/${role}/${item.href}`}
                  onClick={() => {
                    open(item.href, item.title);
                  }}
                  className={cn(
                    "relative flex items-center gap-3 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium my-2",
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
                </Button>
              );
            })
          )}
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
