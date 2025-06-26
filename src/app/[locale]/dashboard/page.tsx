import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "@/i18n/navigation";

const roleRedirectMap: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  AGENT: "/dashboard/agent",
  CUSTOMER: "/dashboard/customer",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const url = new URLSearchParams();

  if (!session) {
    redirect({
      href: "/auth/login",
      locale: "fa",
    });
  }
  redirect({
    href: `/dashboard/${session?.user.role}`,
    locale: "fa",
  });
}
