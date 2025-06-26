"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Funnel, Plus, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useList } from "@/container/ListContainer/ListContainer";
import { IListHeader } from "./meta/types";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";

const ListHeader = ({
  hasRefresh = true,
  filter: Filter,
  formPath,
}: IListHeader) => {
  const { fetch, loading } = useList();
  const [filterOpen, setFilterOpen] = useState<boolean>();
  const router = useRouter();
  const pathname = usePathname();
  const pathType = pathname.split("/")[pathname.split("/").length - 1];

  return (
    <div>
      <div className="flex items-start justify-start gap-2 my-2">
        {
          <Button
            onClick={() => {
              router.push(
                formPath
                  ? `${pathname}/${formPath}?pageType=CREATE`
                  : `${pathname}/${pathType}Form?pageType=CREATE`
              );
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
      </div>

      {Filter && <Filter />}
    </div>
  );
};

export default ListHeader;
