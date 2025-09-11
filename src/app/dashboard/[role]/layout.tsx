import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import DashboardProvider from "../Provider/DashboardProvider";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions);
  // const headersList = await headers();
  // const host = headersList.get("referer"); // e.g., localhost:3000
  // const role = host?.split("/").splice(5)[0];

  return <DashboardProvider>{children}</DashboardProvider>;
}
