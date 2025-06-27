"use client";

import { usetabular } from "@/hooks/useTabular";
import clsx from "clsx";
import { X } from "lucide-react";

const Breadcrumb = () => {
  const { tabs, activeTabId, closeTab, open } = usetabular();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted/40 rounded-lg overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => open(tab.path, tab.title)}
          className={clsx(
            "flex justify-between items-center gap-2 px-3 py-1 rounded-md cursor-pointer transition-colors text-sm max-w-xs",
            tab.id === activeTabId
              ? "bg-orange-500 text-white font-medium"
              : "bg-orange-200 text-black hover:bg-orange-300"
          )}
        >
          <span className="truncate">{tab.title}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className="hover:bg-white/40 rounded-full p-1"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
