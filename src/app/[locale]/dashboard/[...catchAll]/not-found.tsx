"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Player } from "@lordicon/react";
import error404 from "../../../../assets/icons/wired-flat-1140-error-hover-oscillate.json";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

interface NotFoundPageProps {
  route: string;
}

export default function NotFoundPage({ route }: NotFoundPageProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
      >
        <Player size={100} icon={error404} />
      </motion.div>

      <h1 className="text-4xl font-bold mt-6 text-gray-800 dark:text-white">
        صفحه پیدا نشد!
      </h1>

      <p className="text-gray-500 dark:text-gray-300 mt-2 max-w-md">
        متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است حذف شده
        باشد.
      </p>

      <Link className="mt-6" href={route}>
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
