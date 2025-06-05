// components/LanguageSwitcher.tsx
"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "./ui/button";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const otherLocale = locale === "fa" ? "en" : "fa";

  // حذف پیشوند locale از مسیر
  const basePath = pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  return (
    <Link href={basePath} locale={otherLocale}>
      <Button variant="link" className="cursor-pointer text-2xl">
        {otherLocale === "fa" ? "🇮🇷" : "🇬🇧"}
      </Button>
    </Link>
  );
}
