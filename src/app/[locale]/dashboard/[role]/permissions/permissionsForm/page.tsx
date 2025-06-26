"use client";

import { usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import React from "react";

const page = () => {
  const searchParams = useSearchParams(); // get query params
  const pathname = usePathname(); // optional, get current path

  const pageType = searchParams.get("pageType"); // example: /page?id=123

  return <div>Page - ID: {pageType}</div>;
};

export default page;
