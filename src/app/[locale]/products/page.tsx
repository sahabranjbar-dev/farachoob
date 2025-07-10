import { FilterSidebar } from "./components/FilterSidebar";
import { ProductCard } from "./components/ProductCard";
import { SortSelect } from "./components/SortSelect";

interface IProductsPage {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: IProductsPage) {
  const resolvedSearchParams = await searchParams;

  // خواندن پارامترهای دسته‌بندی و برند
  const categoryParam = resolvedSearchParams?.category;
  const brandParam = resolvedSearchParams?.brand;
  const minPrice = resolvedSearchParams?.minPrice
    ? Number(resolvedSearchParams.minPrice)
    : undefined;
  const maxPrice = resolvedSearchParams?.maxPrice
    ? Number(resolvedSearchParams.maxPrice)
    : undefined;

  // تبدیل به آرایه
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

  // شرط داینامیک برای فیلتر دسته‌بندی و برند
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
      gte: resolvedSearchParams?.minPrice
        ? Number(resolvedSearchParams.minPrice)
        : undefined,
      lte: resolvedSearchParams?.maxPrice
        ? Number(resolvedSearchParams.maxPrice)
        : undefined,
    };
  }

  const products = await prisma?.product.findMany({
    where: whereClause,
    include: {
      brand: true,
      category: true,
    },
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter */}
          <aside className="hidden md:block w-64 sticky top-40 h-max">
            <FilterSidebar resolvedSearchParams={resolvedSearchParams} />
          </aside>

          {/* Products Section */}
          <main className="flex-1">
            <div className="mb-4">
              <SortSelect />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8">{/* PaginationWrapper */}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
