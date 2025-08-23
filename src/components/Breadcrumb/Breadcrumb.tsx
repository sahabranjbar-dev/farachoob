"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, XCircle } from "lucide-react";
import useTabular from "@/hooks/useTabular";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React, { forwardRef, useEffect, useRef } from "react";

const Breadcrumb = forwardRef(({}, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { tabs, activeTabId, open, closeTab, closeAllTabs } = useTabular();

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const setTabRef = (id: string) => (el: HTMLButtonElement | null) => {
    tabRefs.current[id] = el;
  };

  useEffect(() => {
    if (!tabsContainerRef.current) return;

    const container = tabsContainerRef.current;
    const activeTabElement = tabRefs.current[activeTabId];

    if (activeTabElement) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeTabElement.getBoundingClientRect();

      const offsetLeft = activeRect.left - containerRect.left;
      const offsetRight = activeRect.right - containerRect.right;

      if (offsetLeft < 0) {
        container.scrollBy({ left: offsetLeft, behavior: "smooth" });
      } else if (offsetRight > 0) {
        container.scrollBy({ left: offsetRight, behavior: "smooth" });
      }
    }
  }, [activeTabId]);

  return (
    <div className="relative flex items-center justify-between px-3  dark:bg-gray-800 border-b h-full">
      <div className="absolute left-0 h-full w-12 bg-gradient-to-r from-neutral-100 dark:from-gray-800 pointer-events-none z-10" />

      <div
        ref={tabsContainerRef}
        className="flex items-center overflow-x-auto scrollbar-hide gap-2 pl-4 max-w-full h-full"
      >
        <AnimatePresence initial={false}>
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    ref={setTabRef(tab.id)}
                    onClick={() => open(tab.path, tab.title)}
                    className={cn(
                      "border border-orange-400 group relative min-w-[180px] max-w-[180px] flex justify-between items-center p-2 rounded-md text-sm transition-all truncate select-none cursor-pointer",
                      tab.id === activeTabId
                        ? "bg-orange-500 text-white shadow-lg font-semibold"
                        : "hover:bg-orange-100 dark:hover:bg-orange-900 text-gray-700 dark:text-gray-300"
                    )}
                    title={tab.title}
                  >
                    <span className="truncate">{tab.title}</span>
                    <X
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className={cn(
                        "ml-2 opacity-70 hover:opacity-100 transition cursor-pointer",
                        tab.id === activeTabId
                          ? "text-white"
                          : "text-orange-600 hover:text-orange-700"
                      )}
                      aria-label={`بستن تب ${tab.title}`}
                      role="button"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="max-w-xs"
                >
                  {tab.title}
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 z-20 pr-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={closeAllTabs}
              className="hover:bg-orange-100 dark:hover:bg-orange-900"
              aria-label="بستن همه تب‌ها"
            >
              <XCircle size={22} className="text-orange-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">بستن همه تب‌ها</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
});

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
