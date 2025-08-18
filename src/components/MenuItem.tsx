import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft } from "lucide-react";
import * as Icons from "lucide-react";
import { usePathname } from "@/i18n/navigation";

interface Props {
  item: {
    title: string;
    href?: string;
    icon?: any;
    subMenus?: Array<{
      title: string;
      href: string;
      icon?: any;
    }>;
  };
  isActive: boolean;
  open: (href: string, title: string) => void;
  index?: number;
  IconComponent?: any;
}

const MenuItem = ({ item, isActive, open, index, IconComponent }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const hasChildren = item.subMenus && item.subMenus.length > 0;

  const getChildIcon = (child: { title: string; href: string; icon?: any }) =>
    (Icons as any)[child.icon] || Icons.Package;

  return (
    <div>
      {/* Main Item */}
      <Button
        key={index}
        variant="ghost"
        className={cn(
          "relative flex items-center justify-between gap-3 p-4 m-2 rounded-lg text-sm transition-colors",
          isActive
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
      >
        {/* Toggle Icon */}
        {hasChildren && (
          <span
            className="ml-auto text-xs cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? <ChevronDown /> : <ChevronLeft />}
          </span>
        )}
        {/* Clickable Title */}
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => item.href && open(item.href, item.title)}
        >
          {IconComponent && <IconComponent size={20} />}
          <span className="truncate">{item.title}</span>
        </div>
      </Button>

      {/* Submenu */}
      {hasChildren && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mx-4 flex flex-col"
            >
              {item.subMenus!.map((child, idx) => {
                const Icon = getChildIcon(child);
                const isChildActive = pathname.includes(child.href);

                return (
                  <Button
                    key={idx}
                    variant="ghost"
                    onClick={() => open(child.href, child.title)}
                    className={cn(
                      "flex items-center gap-3 p-2 text-sm rounded-lg transition-colors",
                      isChildActive
                        ? "bg-orange-400 text-white hover:bg-orange-500"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {child.icon && <Icon size={20} />}
                      <span className="truncate">{child.title}</span>
                    </div>
                  </Button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default MenuItem;
