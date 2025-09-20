import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ModeToggle } from "@/components/ModeToggle";
import NotificationIcon from "@/components/NotificationIcon";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { Bell } from "lucide-react";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen max-w-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <DashboardSidebar
          user={{
            name: session?.user.name ?? "user",
            permissions: session?.user.permissions,
            role: session?.user.role,
            image: session?.user?.image,
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

              <NotificationIcon />
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
