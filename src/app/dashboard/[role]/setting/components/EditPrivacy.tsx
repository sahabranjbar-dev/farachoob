import React from "react";
import { IEditPrivacy } from "../meta/types";
import { useSetting } from "../../../../../../stores/settingStore";

const EditPrivacy = ({ register, watch }: IEditPrivacy) => {
  const userData = useSetting((state) => state.userData);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
        تنظیمات حریم خصوصی
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              پروفایل قابل مشاهده
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              اجازه دهید دیگران پروفایل شما را ببینند
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register?.("profileVisible")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              قابل جستجو بودن
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              اجازه دهید دیگران شما را جستجو کنند
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register?.("searchVisible")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">حریم خصوصی داده‌ها</h3>
        <p className="text-sm text-blue-700">
          ما به حریم خصوصی شما احترام می‌گذاریم. داده‌های شما هرگز بدون رضایت
          شما به اشتراک گذاشته نمی‌شوند.
        </p>
        <button
          type="button"
          className="mt-3 text-sm text-blue-600 font-medium"
        >
          خط‌مشی حریم خصوصی را مطالعه کنید
        </button>
      </div>
    </div>
  );
};

export default EditPrivacy;
