// app/productData/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Product, Variation } from "@/types/Product";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface IProductDataPage {
  productData: Product;
}

export default function ProductDataPage({ productData }: IProductDataPage) {
  const [selectedColor, setSelectedColor] = useState<string>(
    productData?.variations?.[0]?.colorName || ""
  );
  const [showMore, setShowMore] = useState<boolean>(false);
  const params = useParams();
  const id = params.id;
  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* productData Gallery */}
        <div className="relative">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 bg-white shadow-lg rounded-full px-4 py-2 z-10 flex items-center"
          >
            <span
              className={cn("w-3 h-3 rounded-full mx-2 animate-pulse", {
                "bg-green-500": productData?.stock && productData.stock > 0,
                "bg-red-500": !productData?.stock || productData.stock <= 0,
              })}
            ></span>
            <span className="text-sm font-medium text-gray-700">
              {productData?.stock && productData.stock > 0
                ? "موجود در انبار"
                : "ناموجود"}
            </span>
          </motion.div>

          {/* Main Image */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div key={selectedColor} className="w-full h-full">
                <Image
                  src={
                    productData?.variations?.find(
                      (item) => item.colorName === selectedColor
                    )?.images?.[0]?.url || "/images/placeholder.png"
                  }
                  alt={productData?.farsiTitle || "محصول"}
                  fill
                  className="object-contain p-8 transition-all duration-300"
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
              {productData?.variations?.map((item: Variation) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all shadow-md",
                    {
                      "outline-4 outline-blue-600":
                        item.colorName === selectedColor,
                    }
                  )}
                  style={{ backgroundColor: item?.colorCode }}
                  onClick={() => setSelectedColor(item.colorName || "")}
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

        {/* productData Info */}
        <div className="space-y-8">
          {/* Title & Price */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight"
            >
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                نام محصول:{" "}
              </span>
              {productData?.farsiTitle}
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed"
          >
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              توضیحات:
            </span>
            <span className={cn("block", showMore ? "" : "line-clamp-4")}>
              {productData?.description ?? "---"}
            </span>
            <Button
              className="mt-2 text-blue-500"
              variant="link"
              onClick={() => setShowMore(!showMore)}
              left={showMore ? <ChevronUp /> : <ChevronDown />}
            >
              {showMore ? "نمایش کمتر" : "نمایش بیشتر"}
            </Button>
          </motion.p>

          {/* Color Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              رنگ انتخابی:{" "}
              <span className="text-orange-600">{selectedColor}</span>
            </span>
            <div className="flex gap-3 my-2">
              {productData?.variations?.map((color) => (
                <motion.button
                  key={color?.colorName}
                  onClick={() => setSelectedColor(color?.colorName || "")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-fit h-fit p-4 rounded-xl border-2 transition-all flex items-center justify-center text-white",
                    selectedColor === color?.colorName
                      ? "ring-2 ring-offset-2 ring-blue-500 border-white shadow-lg"
                      : "border-gray-200 shadow-md"
                  )}
                  title={color.colorName}
                  style={{ backgroundColor: color?.colorCode }}
                >
                  {color.colorName}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-900">
              ویژگی‌های محصول:
            </h3>
            <div className="relative h-32 overflow-hidden">
              {mockproductData.features.map((feature, index) => (
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
          </motion.div> */}

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
              <span className="text-sm text-gray-500 dark:text-gray-300 dark:text-gray-300">
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
              <span className="text-sm text-gray-500 dark:text-gray-300">
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
              <span className="text-sm text-gray-500 dark:text-gray-300">
                ۲۴ ماه گارانتی شرکتی
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
