"use client";

import { motion } from "framer-motion";

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
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-orange-700">
          {product.title}
        </h3>
        <p className="text-gray-600 mt-1">{product.brand}</p>
        <p className="text-orange-600 mt-2 font-bold">
          {product.price.toLocaleString()} تومان
        </p>
      </div>
    </motion.div>
  );
}
