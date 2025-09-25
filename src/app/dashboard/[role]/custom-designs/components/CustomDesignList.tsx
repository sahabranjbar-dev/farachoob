"use client";
import RowFormButtons from "@/components/RowFormButtons/RowFormButtons";
import TruncatedText from "@/components/TruncatedText";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import useTabular from "@/hooks/useTabular";
import { ITableColumns } from "@/types/table";
import { Eye } from "lucide-react";
import React, { useMemo } from "react";

const CustomDesignList = () => {
  const { open } = useTabular();
  const columns: ITableColumns[] = useMemo(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "name",
        title: "نام و نام خانوادگی",
      },
      {
        field: "mobile",
        title: "شماره موبایل ",
      },
      {
        field: "productType",
        title: "نوع محصول",
      },
      {
        field: "dimensions",
        title: "ابعاد محصول",
      },
      {
        field: "material",
        title: "جنس محصول",
      },
      {
        field: "color",
        title: "رنگ محصول",
      },
      {
        field: "description",
        title: "توضیحات",
        render: (v) =>
          TruncatedText({
            text: v,
            maxLengthDesktop: 50,
          }),
      },
      {
        field: "id",
        title: "عملیات",
        render: (v, row) => {
          return (
            <div className="flex flex-row-reverse items-center justify-center gap-2">
              <RowFormButtons
                id={v}
                deleterUrl={`/dashboard/custom-designs/${v}`}
                title={row.farsiTitle}
                key={v}
              />
              <Tooltip>
                <TooltipTrigger>
                  <Eye
                    onClick={() => {
                      open(
                        `/custom-designs/${v}`,
                        `مشاهده طراحی ${row?.name ?? ""}`
                      );
                    }}
                    className="text-blue-500 cursor-pointer hover:bg-blue-100 transition-colors duration-300 rounded-full h-6 w-6 p-2 box-content"
                  />
                </TooltipTrigger>
                <TooltipContent> مشاهده طراحی {row?.name ?? ""}</TooltipContent>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    []
  );
  return (
    <ListDataProvider>
      <Table data={[]} columns={columns} />
    </ListDataProvider>
  );
};

export default CustomDesignList;
