"use client";

import { usePathname } from "@/i18n/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function useParams<T extends Record<string, string | undefined>>() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<T>({} as T);
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  useEffect(() => {
    const obj = {} as T;

    // Convert URLSearchParams to typed object
    searchParams.forEach((value, key) => {
      obj[key as keyof T] = value as any;
    });

    setParams(obj);
  }, [searchParams]);

  const setActiveParam = useCallback(
    (params: Record<string, any>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      // اضافه کردن یا آپدیت پارامترها
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          newParams.delete(key); // حذف اگر مقدار نال یا آندفایند بود
        } else {
          newParams.set(key, String(value)); // تبدیل به string و تنظیم
        }
      });

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return {
    params,
    setActiveParam,
  };
}

export default useParams;
