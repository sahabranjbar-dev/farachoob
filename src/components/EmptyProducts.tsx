"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptyProducts() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      {/* انیمیشن آیکن */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 12 }}
        className="bg-gradient-to-tr from-orange-500 to-yellow-400 p-6 rounded-full shadow-lg"
      >
        <ShoppingBag className="w-14 h-14 text-white" />
      </motion.div>

      {/* متن */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-6 text-2xl md:text-3xl font-bold text-gray-800"
      >
        هیچ محصولی یافت نشد!
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-3 text-gray-500 max-w-md"
      >
        به نظر میاد چیزی برای نمایش وجود نداره. می‌تونی به صفحه اصلی برگردی.
      </motion.p>

      {/* دکمه‌ها */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 flex gap-4"
      >
        <Button className="rounded-2xl px-6 py-2 shadow-md">
          <Link href="/">بازگشت به صفحه اصلی</Link>
        </Button>
      </motion.div>
    </div>
  );
}
