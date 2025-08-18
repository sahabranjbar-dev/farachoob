"use client";

import React, { cloneElement, createElement, useState } from "react";
import { Button } from "../ui/button";
import { Funnel, Plus, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useList } from "@/container/ListContainer/ListContainer";
import { IListHeader } from "./meta/types";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import useTabular from "@/hooks/useTabular";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import ExportButton from "../ExportButton";

const ListHeader = ({
  hasRefresh = true,
  filter: Filter,
  formPath,
  title,
  hasExport = false,
  exportUrl,
}: IListHeader) => {
  const { fetch, loading } = useList();
  const [filterOpen, setFilterOpen] = useState<boolean>();
  const pathname = usePathname();
  const pathType = pathname.split("/")[pathname.split("/").length - 1];

  const { open } = useTabular();
  return (
    <div>
      <div className="flex items-start justify-start gap-2 my-2">
        {
          <Button
            onClick={() => {
              const path = formPath
                ? `${formPath}`
                : `${pathType}/${pathType}Form`;

              open(path, title ?? "فرم ایجاد", { pageType: "CREATE" });
            }}
            variant="primary"
            tooltip="ایجاد"
          >
            <Plus />
          </Button>
        }
        {hasRefresh && (
          <Button
            variant="outline"
            className="flex items-center gap-1 hover:text-orange-500"
            onClick={() => fetch?.({})}
            disabled={loading}
            tooltip="بروزرسانی"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="outline"
          className={cn("flex items-center gap-1 hover:text-orange-500", {
            "text-red-400 border-orange-400": filterOpen,
          })}
          onClick={() => setFilterOpen((prev) => !prev)}
          tooltip="فیلتر"
        >
          <Funnel />
        </Button>

        {hasExport && exportUrl && <ExportButton exportUrl={exportUrl} />}
      </div>
      <motion.div
        initial={false}
        animate={{
          height: filterOpen ? "auto" : 0,
          minHeight: filterOpen ? "100px" : 0,
        }}
        transition={{ duration: 0.5 }}
        style={{ overflow: "hidden" }}
      >
        {Filter}
      </motion.div>
    </div>
  );
};

export default ListHeader;
