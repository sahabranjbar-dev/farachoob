"use client";

import { useSearchParams, usePathname } from "next/navigation";
import React from "react";

const Page = () => {
  const searchParams = useSearchParams(); // get query params
  const pathname = usePathname(); // optional, get current path

  const pageType = searchParams.get("pageType"); // example: /page?id=123

  console.log("pageType", pageType);
  console.log("pathname:", pathname);

  return <div>Page - ID: {pageType}</div>;
};

export default Page;
