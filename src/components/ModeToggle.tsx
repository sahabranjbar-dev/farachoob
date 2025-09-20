"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-white hover:text-orange-500 transition-colors relative"
        >
          {/* Sun Icon */}
          <Sun
            className={`h-5 w-5 transition-transform ${
              theme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0 "
            }`}
          />
          {/* Moon Icon */}
          <Moon
            className={`h-5 w-5 absolute transition-transform ${
              theme === "dark" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
            }`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          روشن
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          تاریک
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          سیستم
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
