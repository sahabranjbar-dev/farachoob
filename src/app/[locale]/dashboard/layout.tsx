import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Role } from "@/types/dashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  const { name, roles, image, permissions } = session.user as {
    name: string;
    roles: Role[];
    image?: string | null;
    permissions: string[];
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen max-w-screen">
        {/* Sidebar ثابت با عرض مشخص */}
        <DashboardSidebar user={{ name, permissions, image, roles }} />

        {/* Main content که بقیه عرض صفحه رو میگیره */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* هدر */}
          <div className="border-b p-2 flex items-center justify-between">
            <SidebarTrigger className="mb-4" />
          </div>

          {/* محتوای اصلی با اسکرول عمودی فقط */}
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
