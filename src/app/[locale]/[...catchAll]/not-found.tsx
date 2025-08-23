import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { House } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage({ route }: { route: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      <h1 className="text-4xl font-bold mt-6 text-gray-800 dark:text-white">
        صفحه پیدا نشد!
      </h1>

      <p className="text-gray-500 dark:text-gray-300 mt-2 max-w-md">
        متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است حذف شده
        باشد.
      </p>

      <Link
        className="flex items-center gap-2 mt-6 border bg-orange-400 p-4 rounded-2xl text-white hover:bg-orange-500 transition-colors duration-300"
        href={route}
        passHref
      >
        <House />
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
