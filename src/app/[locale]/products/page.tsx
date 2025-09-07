// app/products/page.tsx
import PaginationWrapper from "@/components/Pagination";
import { FilterSidebar } from "./components/FilterSidebar";
import { ProductCard } from "./components/ProductCard";
import { SortSelect } from "./components/SortSelect";
import ProductsPagination from "./components/ProductsPagination";
import ScrollToTopOnPageChange from "./components/ScrollToTopOnPageChange";
import EmptyProducts from "@/components/EmptyProducts";
import prisma from "@/lib/prisma";

interface IProductsPage {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: IProductsPage) {
  const resolvedSearchParams = await searchParams;

  const page = resolvedSearchParams?.page
    ? Number(resolvedSearchParams.page)
    : 1;
  const pageSize = resolvedSearchParams?.pageSize
    ? Number(resolvedSearchParams.pageSize)
    : 9;

  const categoryParam = resolvedSearchParams?.category;
  const brandParam = resolvedSearchParams?.brand;
  const minPrice = resolvedSearchParams?.minPrice
    ? Number(resolvedSearchParams.minPrice)
    : undefined;
  const maxPrice = resolvedSearchParams?.maxPrice
    ? Number(resolvedSearchParams.maxPrice)
    : undefined;
  const sortParam = resolvedSearchParams?.sort || "";

  const categories = Array.isArray(categoryParam)
    ? categoryParam
    : categoryParam
    ? [categoryParam]
    : [];

  const brands = Array.isArray(brandParam)
    ? brandParam
    : brandParam
    ? [brandParam]
    : [];

  const whereClause: any = {};

  if (categories.length > 0) {
    whereClause.category = {
      englishTitle: {
        in: categories,
      },
    };
  }

  if (brands.length > 0) {
    whereClause.brand = {
      englishTitle: {
        in: brands,
      },
    };
  }

  if (minPrice || maxPrice) {
    whereClause.price = {
      gte: minPrice,
      lte: maxPrice,
    };
  }

  // تعیین ترتیب بر اساس پارامتر سورت
  let orderBy: any = { createdAt: "desc" }; // حالت پیش‌فرض

  switch (sortParam) {
    case "name_asc":
      orderBy = { farsiTitle: "asc" };
      break;
    case "name_desc":
      orderBy = { farsiTitle: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const totalItems = await prisma?.product.count({ where: whereClause });
  if (!totalItems) {
    return <EmptyProducts />;
  }

  const products = await prisma?.product.findMany({
    where: whereClause,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy,
    include: {
      brand: true,
      category: true,
      variations: {
        include: {
          images: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen">
      <ScrollToTopOnPageChange />
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="hidden md:block w-64 sticky top-40 h-max">
            <FilterSidebar resolvedSearchParams={resolvedSearchParams} />
          </aside>

          <main className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  {totalItems} محصول یافت شد
                </span>
              </div>
              <SortSelect />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalItems > pageSize && (
              <div className="mt-8">
                <ProductsPagination
                  currentPage={page}
                  totalCount={totalItems}
                  totalPages={Math.ceil(totalItems / pageSize)}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
