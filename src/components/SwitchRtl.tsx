// components/ui/switch-rtl.tsx
"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchRtlProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const SwitchRtl: React.FC<SwitchRtlProps> = ({
  checked,
  onChange,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
        checked ? "bg-primary" : "bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span className="sr-only">تغییر وضعیت</span>
      <motion.span
        className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
        animate={{ x: checked ? -20 : 0 }} // RTL: برعکس
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
};
