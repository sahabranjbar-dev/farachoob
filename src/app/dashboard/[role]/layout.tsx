import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardProvider from "../Provider/DashboardProvider";
import DashboardClient from "../Provider/DashboardClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardProvider>
      <DashboardClient user={session.user}>{children}</DashboardClient>
    </DashboardProvider>
  );
}
