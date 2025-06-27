"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./components/ProductCard";
import { AnimatePresence, motion } from "framer-motion";
import { SortSelect } from "./components/SortSelect";
import PaginationWrapper from "@/components/Pagination";
import { FilterSidebar } from "./components/FilterSidebar";
import DataGetter from "@/container/DataGetter/DataGetter";
import DataLoader from "@/container/DataLoader/DataLoader";
import { IDataLoaderOutput } from "@/container/DataLoader/meta/type";
import { IProduct } from "./meta/types";
import FullScreenLoading from "@/components/FullScreenLoading";

const mockProducts = new Array(8).fill(null).map((_, i) => ({
  id: i + 1,
  title: `محصول ${i + 1}`,
  price: (i + 1) * 100000,
  brand: i % 2 === 0 ? "برند A" : "برند B",
  image: "/3-12.jpg",
}));

function ProductsPage({
  data,
  error,
  fetch,
  loading,
}: IDataLoaderOutput<{ resultList: IProduct[]; page: number }>) {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    <div className="min-h-screen">
      {loading && <FullScreenLoading />}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            className="md:hidden text-orange-600 border border-orange-600 px-3 py-1 rounded"
            onClick={() => setShowMobileFilter(true)}
          >
            فیلتر
          </button>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filter */}
          <aside className="hidden md:block w-64 sticky top-40 h-max">
            <FilterSidebar />
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showMobileFilter && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 right-0 bottom-0 w-3/4 bg-white shadow-lg z-50 p-4 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">فیلتر</h2>
                  <button onClick={() => setShowMobileFilter(false)}>
                    بستن
                  </button>
                </div>
                <FilterSidebar />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Section */}
          <main className="flex-1">
            <div className="mb-4">
              <SortSelect />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8">{/* <PaginationWrapper  /> */}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPageWrapper() {
  return (
    <DataGetter url="/products">
      <DataLoader>
        <ProductsPage />
      </DataLoader>
    </DataGetter>
  );
}
