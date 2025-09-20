import React from "react";
import { useSetting } from "../../../../../../stores/settingStore";
import { ISettingSidebar } from "../meta/types";
import {
  BellRing,
  EarthLock,
  Fingerprint,
  SunMoon,
  UserPen,
} from "lucide-react";

const SettingSidebar = ({ activeTab, setActiveTab }: ISettingSidebar) => {
  return (
    <nav className="space-y-1 ">
      <button
        type="button"
        onClick={() => setActiveTab("profile")}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium cursor-pointer rounded-md ${
          activeTab === "profile"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-200 dark:text-gray-50 hover:dark:text-gray-800 "
        }`}
      >
        <span className="ml-2">
          <UserPen />
        </span>
        پروفایل
      </button>
      {/* <button
        onClick={() => setActiveTab("security")}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium cursor-pointer rounded-md ${
          activeTab === "security"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-200 dark:text-gray-50 hover:dark:text-gray-800"
        }`}
      >
        <span className="ml-2">
          <Fingerprint />
        </span>
        امنیت
      </button> */}
      <button
        type="button"
        onClick={() => setActiveTab("notifications")}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium cursor-pointer rounded-md ${
          activeTab === "notifications"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-200 dark:text-gray-50 hover:dark:text-gray-800"
        }`}
      >
        <span className="ml-2">
          <BellRing />
        </span>
        اعلان‌ها
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("privacy")}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium cursor-pointer rounded-md ${
          activeTab === "privacy"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-200 dark:text-gray-50 hover:dark:text-gray-800"
        }`}
      >
        <span className="ml-2">
          <EarthLock />
        </span>
        حریم خصوصی
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("appearance")}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium cursor-pointer rounded-md ${
          activeTab === "appearance"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-200 dark:text-gray-50 hover:dark:text-gray-800"
        }`}
      >
        <span className="ml-2">
          <SunMoon />
        </span>
        ظاهر
      </button>
    </nav>
  );
};

export default SettingSidebar;
