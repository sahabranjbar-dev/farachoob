import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const roleRedirectMap: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  AGENT: "/dashboard/agent",
  CUSTOMER: "/dashboard/customer",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const roles = session.user.roles || [];

  // پیدا کردن اولین نقش که مسیرش تعریف شده
  const matchedRole = roles.find((role) => roleRedirectMap[role.toUpperCase()]);

  if (matchedRole) {
    redirect(roleRedirectMap[matchedRole.toUpperCase()]);
  } else {
    redirect("/auth/login");
  }
}
