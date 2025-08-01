"use client";
import PaginationWrapper from "@/components/Pagination";

interface ProductsPaginationProps {
  currentPage: number;
  totalCount: number;
  totalPages: number;
}

const ProductsPagination = ({
  currentPage,
  totalCount,
  totalPages,
}: ProductsPaginationProps) => {
  return (
    <>
      <PaginationWrapper
        loading={false}
        currentPage={currentPage}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          const url = new URL(window.location.href);
          url.searchParams.set("page", String(newPage));
          window.history.pushState({}, "", url.toString());
          window.location.reload();
        }}
      />
    </>
  );
};

export default ProductsPagination;
