// components/LanguageSwitcher.tsx
"use client";

import { Link } from "@/i18n/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === "fa" ? "en" : "fa";

  // حذف پیشوند locale از مسیر
  const basePath = pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  return (
    <>
      <Link href={basePath} locale={otherLocale}>
        <Button variant="link" className="cursor-pointer border p-2">
          {otherLocale === "fa" ? "🇮🇷" : "🇬🇧"}
          {/* <DotLottieReact
            src={"/lang.lottie"}
            loop
            autoplay={true}
            className="dark:bg-white "
          /> */}
        </Button>
      </Link>
    </>
  );
}
