import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const roles = session.user.roles || [];

  if (roles.includes("ADMIN")) {
    redirect("/dashboard/admin");
  } else if (roles.includes("MANAGER")) {
    redirect("/dashboard/manager");
  } else if (roles.includes("AGENT")) {
    redirect("/dashboard/agent");
  } else if (roles.includes("CUSTOMER")) {
    redirect("/dashboard/customer");
  } else {
    redirect("/auth/login");
  }
}
