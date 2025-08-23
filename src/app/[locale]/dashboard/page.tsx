import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { getLocale } from "next-intl/server";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  redirect(`/${locale}/dashboard/${session.user.role}`);
}
