"use client";

import { Product } from "@/types/Product";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Star, Eye, Heart, Clock } from "lucide-react";

interface IProductsPage {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: IProductsPage) {
  const { id, farsiTitle, brand, category, description, variations, stock } =
    product;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl =
    variations?.[0]?.images?.[0]?.url || "/images/placeholder.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-white rounded-3xl shadow-2xl overflow-hidden border-0 cursor-pointer relative flex flex-col h-full transform-gpu"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.05)",
      }}
    >
      {/* لینک کلیک‌پذیر برای کل کارت */}
      <Link
        href={`/products/${id}`}
        className="absolute inset-0 z-30"
        aria-label={`مشاهده جزئیات ${farsiTitle}`}
      />

      {/* افکت نور پویا */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,215,0,0.15) 0%, transparent 70%)",
        }}
      />

      {/* بخش تصویر محصول */}
      <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-amber-50" />

        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, delay: index * 0.1 }}
          className="relative w-full h-full"
        >
          <Image
            src={imageUrl}
            alt={farsiTitle ?? "product image"}
            fill
            className={`object-cover transition-all duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${isHovered ? "scale-110" : "scale-100"}`}
            onLoad={() => setImageLoaded(true)}
            unoptimized
            priority={index < 6}
          />
        </motion.div>

        {/* افکت overlay هنگام هاور */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* نوار طلایی پویا */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 transform origin-left z-10"
        />
      </div>

      {/* محتوای محصول */}
      <div className="p-6 relative z-20 bg-transparent flex-grow flex flex-col">
        {/* عنوان و برند */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1 leading-tight">
            {farsiTitle}
          </h3>
          {brand?.id && (
            <p className="text-sm text-blue-600 font-medium">
              برند: {brand.farsiTitle}
            </p>
          )}
        </div>

        {/* دسته‌بندی و امتیاز */}
        <div className="flex items-center justify-between mb-4">
          {category?.id && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              {category.farsiTitle}
            </span>
          )}

          {/* امتیاز محصول */}
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold">4.8</span>
            <span className="text-xs text-gray-500">(24)</span>
          </div>
        </div>

        {/* توضیحات */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {description}
        </p>
      </div>

      {/* افکت border انیمیشنی */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 p-0.5 -z-10"
        style={{
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />
    </motion.div>
  );
}
