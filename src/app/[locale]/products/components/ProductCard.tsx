"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function ProductCard({ product }: { product: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl hover:-translate-y-1 transition-transform duration-300"
    >
      <img
        src={product.image}
        alt={product.farsiTitle}
        width={200}
        height={200}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-orange-700">
          {product.farsiTitle}
        </h3>
        <p className="text-gray-600 mt-1">برند : {product.brand?.farsiTitle}</p>
        <p className="text-gray-600 mt-1">
          دسته‌بندی : {product.category?.farsiTitle}
        </p>
        <p className="text-gray-600 mt-1">{product.description}</p>
        <p className="text-orange-600 mt-2 font-bold">
          {product.price.toLocaleString()} تومان
        </p>
      </div>
    </motion.div>
  );
}
