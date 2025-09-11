"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface Props {
  visibleBackground?: boolean;
}

const FullScreenLoading = ({ visibleBackground = true }: Props) => {
  return (
    <div
      className={cn(
        "bg-white absolute w-full h-full inset-0 z-500 flex items-center justify-center dark:bg-black",
        {
          "bg-white/80 dark:bg-black/50": visibleBackground,
        }
      )}
    >
      <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
    </div>
  );
};

export default FullScreenLoading;
