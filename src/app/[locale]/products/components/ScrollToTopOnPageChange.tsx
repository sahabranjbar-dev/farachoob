"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ScrollToTopOnPageChange() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  useEffect(() => {
    if (page) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  return null;
}
