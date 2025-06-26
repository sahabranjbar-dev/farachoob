"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ITable, ITableColumns } from "../../types/table";
import { useList } from "../../container/ListContainer/ListContainer";
import { Skeleton } from "./skeleton";

function Table({
  className,
  columns,
}: ITable & Omit<React.ComponentProps<"table">, "loading">) {
  const { data: listData, loading, error } = useList();
  console.log(listData, "listData");

  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
      >
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              return (
                <TableHead
                  key={column.field}
                  className="text-center bg-gray-500 text-neutral-100"
                >
                  {column?.title}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <>
              <Skeleton className="w-full p-2 m-2 h-12" />
              <Skeleton className="w-full p-2 m-2 h-12" />
              <Skeleton className="w-full p-2 m-2 h-12" />
              <Skeleton className="w-full p-2 m-2 h-12" />
            </>
          ) : (
            listData?.map((item: any) => {
              // console.log(item, "item");

              return (
                <TableRow key={item.field}>
                  {columns.map((column: ITableColumns) => {
                    // console.log(item[column.field], column.title, "columns");

                    return (
                      <TableCell key={column.field} className="text-center">
                        {item?.id && column?.render
                          ? column?.render?.(item?.[column?.field])
                          : item?.[column?.field] ?? "---"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
        <TableFooter></TableFooter>
      </table>
    </div>
  );
}

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
