"use client";

import { usePathname } from "@/i18n/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function useParams<T extends Record<string, string | string[] | undefined>>() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<T>({} as T);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const obj: Record<string, string | string[]> = {};

    for (const [key, value] of searchParams.entries()) {
      if (obj[key]) {
        // اگر قبلاً مقدار داشت، آرایه کن
        obj[key] = Array.isArray(obj[key])
          ? [...(obj[key] as string[]), value]
          : [obj[key] as string, value];
      } else {
        obj[key] = value;
      }
    }

    setParams(obj as T);
  }, [searchParams]);

  const setActiveParam = useCallback(
    (newValues: Record<string, string | string[] | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(newValues).forEach(([key, value]) => {
        newParams.delete(key); // اول حذف کنیم همه‌ی مقادیر قبلی رو

        if (Array.isArray(value)) {
          value.forEach((val) => newParams.append(key, val));
        } else if (typeof value === "string") {
          newParams.set(key, value);
        }
        // اگر undefined باشه، حذف می‌مونه
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
