import { redirect } from "@/i18n/navigation";
import { getServerSession } from "next-auth";
import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
import DashboardProvider from "../Provider/DashboardProvider";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  const headersList = await headers();
  const host = headersList.get("referer"); // e.g., localhost:3000

  const role = host?.split("/").splice(5)[0];

  if (role !== session?.user.role) {
    return redirect({
      href: `/dashboard/${session?.user?.role}`,
      locale,
    });
  }
  return <DashboardProvider>{children}</DashboardProvider>;
}
