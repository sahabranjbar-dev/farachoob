import { redirect } from "@/i18n/navigation";
import { getServerSession } from "next-auth/next";
import { getLocale } from "next-intl/server";

export default async function DashboardPage() {
  const session = await getServerSession();
  const locale = await getLocale();
  if (!session) {
    return redirect({
      href: "/auth/login",
      locale: locale,
    });
  }
  return redirect({
    href: `/dashboard/${session?.user.role}`,
    locale: locale,
  });
}
