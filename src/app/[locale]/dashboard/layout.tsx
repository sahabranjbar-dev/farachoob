"use client";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/ModeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();

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
          <header className="border-b p-4 flex items-center justify-between bg-white dark:bg-gray-800 transition-colors">
            <div className="flex items-center gap-4">
              <SidebarTrigger />

              <div>
                <Breadcrumb />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ModeToggle />

              {/* Language Toggle */}
              <LanguageSwitcher />
            </div>
          </header>

          <main className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
