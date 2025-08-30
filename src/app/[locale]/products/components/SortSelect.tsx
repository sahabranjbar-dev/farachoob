// app/products/components/SortSelect.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export const SortSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    // حذف صفحه هنگام تغییر سورت
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") || "";

  return (
    <div className="flex items-center gap-4">
      <label
        htmlFor="sort"
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        مرتب‌سازی بر اساس:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="">پیش‌فرض</option>
        <option value="name_asc">نام (الف-ی)</option>
        <option value="name_desc">نام (ی-الف)</option>
        <option value="newest">جدیدترین</option>
        <option value="oldest">قدیمی‌ترین</option>
      </select>
    </div>
  );
};
