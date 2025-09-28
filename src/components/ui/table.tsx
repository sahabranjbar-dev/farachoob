"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ITable, ITableColumns } from "../../types/table";
import { useList } from "../../container/ListContainer/ListContainer";
import { Skeleton } from "./skeleton";
import { AlertTriangle } from "lucide-react";
import PaginationWrapper from "../Pagination";

function Table({
  className,
  columns,
}: ITable & Omit<React.ComponentProps<"table">, "loading">) {
  const { data, loading, error, fetch } = useList();

  const listData = data?.resultList;

  const renderCellContent = (
    column: ITableColumns,
    item: any,
    rowIndex: number
  ) => {
    const value = item?.[column.field];

    if (typeof column.render === "function") {
      try {
        return column.render(value, item, { index: rowIndex });
      } catch (e) {
        console.error("render error in column:", column.field, e);
        return "خطا در رندر";
      }
    }

    if (column.hasDateFormatter && value) {
      try {
        return new Date(value).toLocaleDateString("fa");
      } catch {
        return "تاریخ نامعتبر";
      }
    }

    return value ?? "---";
  };

  const renderLoadingState = () => (
    <TableRow>
      {columns.map((column, i) => (
        <TableCell
          key={i}
          style={{
            width: column.width || "auto",
            minWidth: column.width || "100px",
          }}
        >
          <Skeleton className="h-5 w-full bg-gray-300/50 rounded" />
        </TableCell>
      ))}
    </TableRow>
  );

  const renderDataRows = () =>
    listData && listData.length > 0 ? (
      listData.map((item: any, index: number) => (
        <TableRow key={index}>
          {columns.map((column) => (
            <TableCell
              key={column.field}
              className="text-center truncate px-2 py-3"
              style={{
                width: column.width || "auto",
                minWidth: column.width || "100px",
              }}
            >
              {renderCellContent(column, item, index)}
            </TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={columns.length} className="text-center py-6">
          <p className="text-gray-500">هیچ داده‌ای برای نمایش وجود ندارد.</p>
        </TableCell>
      </TableRow>
    );

  return (
    <div className="relative w-full border rounded-md shadow-sm mb-32">
      {/* Container برای اسکرول افقی */}
      <div className="overflow-x-auto w-full">
        <table
          className={cn(
            "w-full text-sm caption-bottom min-w-full", // مهم: min-w-full
            className
          )}
        >
          <TableHeader>
            <TableRow className="bg-muted/30">
              {columns.map((column) => (
                <TableHead
                  key={column.field}
                  className="text-center px-2 py-3 whitespace-nowrap font-semibold text-gray-800"
                  style={{
                    width: column.width || "auto",
                    minWidth: column.width || "100px", // مهم: minWidth
                  }}
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <React.Fragment key={i}>{renderLoadingState()}</React.Fragment>
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  <div className="flex flex-col items-center gap-2 text-red-600">
                    <AlertTriangle className="w-8 h-8" />
                    <p className="text-sm font-medium">
                      متاسفانه مشکلی در دریافت اطلاعات رخ داده است.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              renderDataRows()
            )}
          </TableBody>

          {!error && (
            <TableFooter>
              <TableRow className="max-w-full min-h-32 absolute right-0 left-0 -bottom-5">
                <TableCell
                  colSpan={columns.length}
                  className="flex justify-between items-center"
                >
                  <PaginationWrapper
                    loading={loading ?? true}
                    currentPage={data?.page}
                    totalCount={data?.totalItems}
                    totalPages={data?.totalPages}
                    onPageChange={(page) => {
                      fetch?.({
                        inputParams: {
                          page,
                        },
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </table>
      </div>
    </div>
  );
}

// بقیه کامپوننت‌ها بدون تغییر...
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
