"use client";

import { Product } from "@/types/Product";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface IProductsPage {
  product: Product;
}

export function ProductCard({ product }: IProductsPage) {
  const { id, farsiTitle, brand, category, description, variations } = product;

  const imageUrl =
    variations?.[0]?.images?.[0]?.url || "/images/placeholder.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* تصویر محصول با نوار طلایی زیرش */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={farsiTitle ?? "product image"}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />

        {/* نوار طلایی */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-amber-500 to-yellow-400" />
      </div>

      {/* اطلاعات محصول */}
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-700 transition-colors duration-300">
          {farsiTitle}
        </h3>

        {brand?.id && (
          <p className="text-sm text-gray-500">برند: {brand?.farsiTitle}</p>
        )}

        {category?.id && (
          <p className="text-sm text-gray-500">
            دسته‌بندی: {category?.farsiTitle}
          </p>
        )}

        <p className="text-sm text-gray-600 line-clamp-2 h-10">{description}</p>
      </div>

      {/* دکمه‌ی مشاهده فقط روی هاور */}
      <div className="px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link href={`/products/${id}`}>
          <button className="cursor-pointer w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-colors">
            مشاهده محصول
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
