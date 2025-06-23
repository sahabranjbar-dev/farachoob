import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/ModeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
            // TODO: check is necessery
            permissions: session?.user.permissions,
            roles: session?.user.role,
            image: session?.user?.image,
          }}
        />

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
