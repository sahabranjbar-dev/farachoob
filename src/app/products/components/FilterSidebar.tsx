import { ScrollArea } from "@/components/ui/scroll-area";
import FilterItems from "./FilterItems";
import PriceFilter from "./PriceFilter";
import prisma from "@/lib/prisma";

interface Props {
  resolvedSearchParams?: any;
}
export async function FilterSidebar({ resolvedSearchParams }: Props) {
  const categories = await prisma?.category.findMany();
  const brands = await prisma?.brand.findMany();
  return (
    <div className="space-y-6 bg-white dark:bg-black p-4 border-2 shadow-2xl rounded-2xl min-h-96">
      <h1>فیلترها</h1>
      <ScrollArea dir="rtl" className="h-full">
        <FilterItems
          filtersContent={categories}
          title="دسته‌بندی‌ها"
          paramName="category"
        />

        <FilterItems filtersContent={brands} title="برندها" paramName="brand" />

        {/* <PriceFilter /> */}
      </ScrollArea>
    </div>
  );
}
