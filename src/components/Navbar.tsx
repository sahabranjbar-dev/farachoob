"use client";

import useDataGetter from "@/hooks/useDataGetter";
import clsx from "clsx";
import { debounce } from "lodash";
import {
  Blocks,
  FileUser,
  House,
  Newspaper,
  PhoneOutgoing,
  Sofa,
  TriangleAlert,
  ChevronLeft,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface ICategory {
  id: string;
  farsiTitle: string;
  englishTitle: string;
  createdAt: string;
  updateAt: string;
}

export interface IProduct {
  id: string;
  title: string;
  farsiTitle: string;
  image: string;
  price: number;
  categoryId: string;
  createdAt: string;
}

const navItems = [
  { id: "home", title: "خانه", url: "/", icon: House },
  { id: "blogs", title: "مقالات", url: "/blogs", icon: Newspaper },
  {
    id: "contact",
    title: "تماس با ما",
    url: "/contact-us",
    icon: PhoneOutgoing,
  },
  { id: "about", title: "درباره ما", url: "/about-us", icon: FileUser },
  { id: "products", title: "محصولات", url: "/products", icon: Sofa },
  { id: "projects", title: "پروژه‌ها", url: "/projects", icon: Blocks },
];

const Navbar = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);

  const {
    data: productCategories = [],
    loading: isLoadingCategories,
    error: categoriesError,
    fetch: refetchCategories,
  } = useDataGetter<ICategory[]>({ url: "/categories" });

  const {
    data: products = [],
    loading: isLoadingProducts,
    fetch: fetchProducts,
  } = useDataGetter<IProduct[]>({
    url: "/products",
    immediatelyFetch: false,
  });

  const clearHover = useMemo(
    () =>
      debounce(() => {
        setHovered(null);
        setActiveCategory(null);
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      clearHover.cancel();
    };
  }, [clearHover]);

  const handleCategoryHover = (category: ICategory) => {
    setActiveCategory(category);
    fetchProducts?.({
      inputParams: {
        category: category.englishTitle.trim().replace(/\s+/g, "_"),
      },
    });
  };

  const categoryLinks = useMemo(() => {
    if (!productCategories?.length) return null;

    return productCategories.map((cat) => (
      <motion.div
        key={cat.id}
        whileHover={{ scale: 1.02 }}
        className={clsx(
          "p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between",
          activeCategory?.id === cat.id
            ? "bg-orange-100 text-orange-700 shadow-md"
            : "bg-gradient-to-tr from-gray-50 to-white hover:bg-gray-100 text-gray-700"
        )}
        onMouseEnter={() => handleCategoryHover(cat)}
      >
        <span className="text-sm font-medium">{cat.farsiTitle}</span>
        <ChevronLeft
          size={16}
          className={clsx(
            "transition-transform",
            activeCategory?.id === cat.id ? "rotate-0" : "-rotate-90"
          )}
        />
      </motion.div>
    ));
  }, [productCategories, activeCategory]);

  const categoryProducts = useMemo(() => {
    if (!activeCategory || isLoadingProducts) return null;

    const filteredProducts = products?.filter(
      (product) => product.categoryId === activeCategory.id
    );

    if (filteredProducts?.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <ImageIcon size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-sm">
            محصولی در این دسته‌بندی وجود ندارد
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {filteredProducts?.slice(0, 3).map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.farsiTitle}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon size={20} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                {product.farsiTitle}
              </h4>
              <p className="text-xs text-orange-600 mt-1">
                {product.price.toLocaleString()} تومان
              </p>
            </div>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 pt-3 border-t border-gray-100"
        >
          <Link
            href={`/products?category=${activeCategory.englishTitle}`}
            className="text-xs text-orange-500 hover:text-orange-700 font-medium flex items-center justify-center gap-1"
          >
            مشاهده همه محصولات این دسته
            <ChevronLeft size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }, [activeCategory, products, isLoadingProducts]);

  return (
    <nav className="hidden md:flex items-center justify-center gap-8 bg-white/20 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-lg border border-white/30 relative">
      {navItems.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => {
            clearHover.cancel();
            setHovered(item.id);
          }}
          onMouseLeave={clearHover}
        >
          <Link href={item.url}>
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 group cursor-pointer">
              <motion.div whileHover={{ scale: 1.2, rotate: -5 }}>
                <item.icon
                  size={20}
                  className="transition-colors duration-300 group-hover:text-orange-500"
                />
              </motion.div>
              <span
                className={clsx(
                  "relative transition-colors duration-300 group-hover:text-orange-500",
                  {
                    "text-orange-600 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[3px] after:rounded-full after:bg-gradient-to-r after:from-orange-400 after:to-orange-600":
                      pathname === item.url,
                  }
                )}
              >
                {item.title}
              </span>
            </div>
          </Link>

          {/* زیرمنوی محصولات */}
          {item.id === "products" && (
            <AnimatePresence>
              {hovered === "products" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[800px] p-5 bg-white rounded-2xl shadow-xl border z-50 flex"
                  onMouseEnter={() => clearHover.cancel()}
                  onMouseLeave={clearHover}
                >
                  {/* بخش دسته‌بندی‌ها */}
                  <div className="w-1/3 border-left border-gray-200 pr-5 mr-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                      دسته‌بندی‌ها
                    </h3>
                    <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto">
                      {isLoadingCategories && (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                        </div>
                      )}
                      {categoriesError && (
                        <div className="flex flex-col items-center gap-2 text-red-500 py-4">
                          <TriangleAlert size={32} />
                          <span className="text-sm">
                            خطا در دریافت دسته‌بندی‌ها
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetchCategories?.({})}
                          >
                            تلاش دوباره
                          </Button>
                        </div>
                      )}
                      {!isLoadingCategories &&
                        !categoriesError &&
                        categoryLinks}
                      {!isLoadingCategories &&
                        !categoriesError &&
                        !productCategories?.length && (
                          <span className="text-center text-gray-400 text-sm py-4">
                            دسته‌بندی‌ای یافت نشد
                          </span>
                        )}
                    </div>
                  </div>

                  {/* بخش محصولات */}
                  <div className="w-2/3">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                      {activeCategory
                        ? `آخرین محصولات ${activeCategory.farsiTitle}`
                        : "انتخاب دسته‌بندی"}
                    </h3>

                    {!activeCategory ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <ImageIcon size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500">
                          یک دسته‌بندی را انتخاب کنید تا محصولات آن نمایش داده
                          شوند
                        </p>
                      </div>
                    ) : isLoadingProducts ? (
                      <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex gap-3 p-3">
                            <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      categoryProducts
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
