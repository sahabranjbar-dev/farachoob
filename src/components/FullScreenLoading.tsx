"use client";
import { Loader2 } from "lucide-react";
import React from "react";

const FullScreenLoading = () => {
  return (
    <div className="absolute w-full h-full inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/50">
      <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
    </div>
  );
};

export default FullScreenLoading;
