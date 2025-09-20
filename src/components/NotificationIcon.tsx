"use client";
import useTabular from "@/hooks/useTabular";
import { Bell } from "lucide-react";
import React from "react";

const NotificationIcon = () => {
  const { open } = useTabular();
  return (
    <div
      className="flex items-center gap-2 ml-2 pl-2 relative"
      onClick={() => {
        open("/notifications", "اعلان‌ها");
      }}
    >
      <Bell
        className="hover:bg-gray-200 cursor-pointer transition-colors duration-150  rounded-full p-2"
        size={40}
      />
    </div>
  );
};

export default NotificationIcon;
