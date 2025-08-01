"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Skeleton } from "./ui/skeleton";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange: (page: number) => void;
  totalCountName?: string;
  loading: boolean;
}

const PaginationWrapper = ({
  currentPage,
  totalPages = 1,
  totalCount,
  onPageChange,
  loading,
  totalCountName = "مورد",
}: PaginationProps) => {
  const renderPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "cursor-pointer rounded-lg px-3 py-1 min-w-[36px] text-center transition-all text-sm border",
            currentPage === page
              ? "bg-orange-500 text-white border-orange-500"
              : "hover:bg-orange-100 hover:text-orange-500 border-gray-200"
          )}
        >
          {page}
        </button>
      ));
    }

    const pages = [];
    const leftBound = Math.max(2, currentPage - 1);
    const rightBound = Math.min(totalPages - 1, currentPage + 1);

    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={cn(
          "cursor-pointer rounded-lg px-3 py-1 min-w-[36px] text-center transition-all text-sm border",
          currentPage === 1
            ? "bg-orange-500 text-white border-orange-500"
            : "hover:bg-orange-100 hover:text-orange-500 border-gray-200"
        )}
      >
        1
      </button>
    );

    if (leftBound > 2) {
      pages.push(
        <span key="left-ellipsis" className="px-2 text-gray-400">
          ...
        </span>
      );
    }

    for (let page = leftBound; page <= rightBound; page++) {
      pages.push(
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "rounded-lg px-3 py-1 min-w-[36px] text-center transition-all text-sm border",
            currentPage === page
              ? "bg-orange-500 text-white border-orange-500"
              : "hover:bg-orange-100 hover:text-orange-500 border-gray-200"
          )}
        >
          {page}
        </button>
      );
    }

    if (rightBound < totalPages - 1) {
      pages.push(
        <span key="right-ellipsis" className="px-2 text-gray-400">
          ...
        </span>
      );
    }

    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className={cn(
          "cursor-pointer rounded-lg px-3 py-1 min-w-[36px] text-center transition-all text-sm border",
          currentPage === totalPages
            ? "bg-orange-500 text-white border-orange-500"
            : "hover:bg-orange-100 hover:text-orange-500 border-gray-200"
        )}
      >
        {totalPages}
      </button>
    );

    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-gray-100 mt-4 w-full">
      {loading ? (
        <div className="flex items-center">
          <Skeleton className="w-16 h-6 bg-gray-300/50 rounded ml-2" />
          <Skeleton className="w-20 h-6 bg-gray-300/50 rounded" />
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          صفحه <span className="font-bold text-orange-500">{currentPage}</span>{" "}
          از <span className="font-bold text-orange-500">{totalPages}</span> –
          مجموع{" "}
          <span className="font-bold text-orange-500">{totalCount ?? 0}</span>{" "}
          {totalCountName}
        </div>
      )}

      <div className="flex items-center gap-1">
        {loading ? (
          <div className="flex items-center">
            <Skeleton className="w-9 h-8 bg-gray-300/50 rounded ml-1" />
            <Skeleton className="w-9 h-8 bg-gray-300/50 rounded ml-1" />
            <Skeleton className="w-9 h-8 bg-gray-300/50 rounded ml-1" />
            <Skeleton className="w-9 h-8 bg-gray-300/50 rounded ml-1" />
            <Skeleton className="w-9 h-8 bg-gray-300/50 rounded " />
          </div>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => currentPage > 1 && onPageChange(1)}
                  disabled={currentPage === 1}
                  className={cn(
                    "cursor-pointer rounded-lg p-2 border border-gray-200 transition-colors",
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-orange-100 hover:text-orange-500"
                  )}
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>رفتن به اولین صفحه</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    currentPage > 1 && onPageChange(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  className={cn(
                    "cursor-pointer rounded-lg p-2 border border-gray-200 transition-colors",
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-orange-100 hover:text-orange-500"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>صفحه قبل</TooltipContent>
            </Tooltip>

            {renderPageNumbers()}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    currentPage < totalPages && onPageChange(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                  className={cn(
                    "cursor-pointer rounded-lg p-2 border border-gray-200 transition-colors",
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-orange-100 hover:text-orange-500"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>صفحه بعد</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    currentPage < totalPages && onPageChange(totalPages)
                  }
                  disabled={currentPage === totalPages}
                  className={cn(
                    "cursor-pointer rounded-lg p-2 border border-gray-200 transition-colors",
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-orange-100 hover:text-orange-500"
                  )}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>رفتن به آخرین صفحه</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default PaginationWrapper;
