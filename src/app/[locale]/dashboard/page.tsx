"use client";
import { redirect } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";

export default function DashboardPage() {
  const session = useSession();
  const locale = useLocale();
  if (!session) {
    redirect({
      href: "/auth/login",
      locale,
    });
    return;
  }
  return redirect({
    href: `/dashboard/${session?.data?.user.role}`,
    locale,
  });
}
