"use client";

import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Role } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/ModeToggle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        در حال بارگذاری...
      </div>
    );
  }

  if (!session) {
    return null; // چون useEffect ریدایرکت می‌کنه، اینجا چیزی رندر نمی‌کنیم.
  }

  const { name, roles, image, permissions } = session.user as {
    name: string;
    roles: Role[];
    image?: string | null;
    permissions: string[];
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen max-w-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <DashboardSidebar user={{ name, permissions, image, roles }} />

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Header */}
          <header className="border-b p-4 flex items-center justify-between bg-white dark:bg-gray-800 transition-colors">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
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
