import PaginationWrapper from "@/components/Pagination";
import { FilterSidebar } from "./components/FilterSidebar";
import { ProductCard } from "./components/ProductCard";
import { SortSelect } from "./components/SortSelect";
import ProductsPagination from "./components/ProductsPagination";
import ScrollToTopOnPageChange from "./components/ScrollToTopOnPageChange";

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

  const totalItems = await prisma?.product.count({ where: whereClause });
  if (!totalItems) {
    return (
      <div className="text-center text-gray-500">هیچ محصولی یافت نشد.</div>
    );
  }
  const products = await prisma?.product.findMany({
    where: whereClause,
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      brand: true,
      category: true,
    },
  });

  console.log({ products });

  return (
    <div className="min-h-screen">
      <ScrollToTopOnPageChange />
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="hidden md:block w-64 sticky top-40 h-max">
            <FilterSidebar resolvedSearchParams={resolvedSearchParams} />
          </aside>

          <main className="flex-1">
            <div className="mb-4">
              <SortSelect />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8">
              <ProductsPagination
                currentPage={page}
                totalCount={totalItems}
                totalPages={Math.ceil(totalItems / pageSize)}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
