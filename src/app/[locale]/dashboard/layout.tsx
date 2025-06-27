"use client";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import FullScreenLoading from "@/components/FullScreenLoading";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/ModeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useTabular from "@/hooks/useTabular";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();
  const { isPending } = useTabular();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen max-w-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <DashboardSidebar
          user={{
            name: data?.user.name ?? "user",
            // TODO: check is necessery
            permissions: data?.user.permissions,
            roles: data?.user.role,
            image: data?.user?.image,
          }}
        />

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Header */}
          <header className="border-b bg-white dark:bg-gray-800 transition-colors">
            <div className="flex items-center w-full gap-4">
              <SidebarTrigger />

              {/* این div برای اسکرول افقی breadcrumb */}
              <div className="flex-1 min-w-0 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-200 scrollbar-track-gray-50 mx-2 h-[100px]">
                <Breadcrumb />
              </div>

              <div className="flex items-center gap-2">
                <ModeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
            {isPending ? <FullScreenLoading /> : children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
