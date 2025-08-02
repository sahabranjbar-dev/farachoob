// app/product/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import useDataGetter from "@/hooks/useDataGetter";
import { useParams } from "next/navigation";
import FullScreenLoading from "@/components/FullScreenLoading";

const availableColors = ["black", "gray", "blue"] as const;
type Color = (typeof availableColors)[number];

const mockProduct = {
  title: "صندلی مدیریتی ارگونومیک",
  description:
    "صندلی ارگونومیک با طراحی مدرن، مناسب برای استفاده طولانی‌مدت در محیط‌های اداری. دارای تنظیمات متنوع برای راحتی کامل و پشتیبانی از ستون فقرات.",
  price: 5400000,
  images: {
    black: "/desk.jpg",
    gray: "/desk.jpg",
    blue: "/desk.jpg",
  } as Record<Color, string>,
  availableColors,
  colorNames: {
    black: "مشکی",
    gray: "طوسی",
    blue: "آبی",
  } as Record<Color, string>,
  features: [
    "پشتیبانی کمری قابل تنظیم",
    "دسته‌های 3D با قابلیت تنظیم ارتفاع",
    "فوم با تراکم بالا برای راحتی طولانی مدت",
    "قابلیت چرخش 360 درجه",
    "پایه فلزی مقاوم",
  ],
};

const colorClasses = {
  black: "bg-gray-900",
  gray: "bg-gray-400",
  blue: "bg-blue-500",
};

const colorHoverClasses = {
  black: "hover:bg-gray-800",
  gray: "hover:bg-gray-300",
  blue: "hover:bg-blue-400",
};

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState<Color>("black");
  const [isHovering, setIsHovering] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const params = useParams();
  const id = params.id;
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % mockProduct.features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { data: product, loading } = useDataGetter({
    url: `/products/${id}`,
  });
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      {loading && <FullScreenLoading />}
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-r from-blue-50 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Gallery */}
        <div className="relative">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 bg-white shadow-lg rounded-full px-4 py-2 z-10 flex items-center"
          >
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">
              موجود در انبار
            </span>
          </motion.div>

          {/* Main Image */}
          <div
            className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div key={selectedColor} className="w-full h-full">
                <Image
                  src={product?.image || "/images/placeholder.png"}
                  alt={product?.farsiTitle || "محصول"}
                  fill
                  className="object-contain p-8 transition-all duration-300"
                  style={{ transform: isHovering ? "scale(1.05)" : "scale(1)" }}
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Color Swatches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-6 left-6 right-6 flex justify-center gap-3"
            >
              {mockProduct.availableColors.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all shadow-md",
                    colorClasses[color],
                    colorHoverClasses[color],
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-orange-500 border-white scale-110"
                      : "border-gray-200"
                  )}
                  title={mockProduct.colorNames[color]}
                />
              ))}
            </motion.div>
          </div>

          {/* 3D View Button */}
          {/* <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            مشاهده 360 درجه
          </motion.button> */}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Title & Price */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 leading-tight"
            >
              {product?.farsiTitle}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <span className="text-3xl font-extrabold text-orange-600">
                {mockProduct.price.toLocaleString()} تومان
              </span>
              <span className="text-sm line-through text-gray-400">
                ۶٬۲۰۰٬۰۰۰ تومان
              </span>
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                ۱۵٪ تخفیف
              </span>
            </motion.div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg leading-relaxed"
          >
            {product?.description || mockProduct.description}
          </motion.p>

          {/* Color Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-900">
              رنگ انتخابی:{" "}
              <span className="text-orange-600">
                {mockProduct.colorNames[selectedColor]}
              </span>
            </h3>
            <div className="flex gap-3">
              {mockProduct.availableColors.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center",
                    colorClasses[color],
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-orange-500 border-white shadow-lg"
                      : "border-gray-200 shadow-md"
                  )}
                  title={mockProduct.colorNames[color]}
                >
                  {selectedColor === color && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-900">
              ویژگی‌های محصول:
            </h3>
            <div className="relative h-32 overflow-hidden">
              {mockProduct.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: index === activeFeature ? 1 : 0,
                    y: index === activeFeature ? 0 : 20,
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-orange-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              افزودن به سبد خرید
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              افزودن به علاقه‌مندی‌ها
            </motion.button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-6 border-t border-gray-200 flex flex-wrap gap-6"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <span className="text-sm text-gray-500">
                ارسال رایگان برای خریدهای بالای ۱ میلیون تومان
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-500">
                ۷ روز ضمانت بازگشت وجه
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-sm text-gray-500">
                ۲۴ ماه گارانتی شرکتی
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
