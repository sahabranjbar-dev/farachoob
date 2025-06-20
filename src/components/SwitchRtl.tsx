// components/ui/switch-rtl.tsx
"use client";

import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import * as React from "react";

interface SwitchRtlProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const SwitchRtl: React.FC<SwitchRtlProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
        checked ? "bg-primary" : "bg-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className="sr-only">تغییر وضعیت</span>
      <motion.span
        className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
        animate={{ x: checked ? -20 : 0 }} // 🔥 برعکس چون RTL هست
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
};
