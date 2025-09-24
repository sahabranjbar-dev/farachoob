// components/TruncatedText.tsx
"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface TruncatedTextProps {
  text: string;
  maxLengthMobile?: number;
  maxLengthDesktop?: number;
  className?: string;
}

function TruncatedText({
  text,
  maxLengthMobile = 30,
  maxLengthDesktop = 100,
  className,
}: TruncatedTextProps) {
  const truncateText = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <>
      {/* نسخه موبایل */}
      <span className={cn("block md:hidden", className)}>
        {truncateText(text, maxLengthMobile)}
      </span>

      {/* نسخه دسکتاپ */}
      <span className={cn("hidden md:block", className)}>
        {truncateText(text, maxLengthDesktop)}
      </span>
    </>
  );
}

export default TruncatedText;
