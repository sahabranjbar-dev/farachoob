import React from "react";
import { INotificationsEdit } from "../meta/types";
import { useSetting } from "../../../../../../stores/settingStore";
import useSubscribe from "@/hooks/useSubscribe";

const NotificationsEdit = ({ register, watch }: INotificationsEdit) => {
  const setUserData = useSetting((state) => state.setUserData);

  const { subscribe, subscription } = useSubscribe();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
        تنظیمات اعلان‌ها
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              ایمیل
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ارسال اعلان‌ها از طریق ایمیل
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register?.("emailNotification")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200  peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              اعلان‌های push
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              دریافت اعلان‌ها در مرورگر
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register?.("browserNotification")}
              onChange={(e) => {
                const pushNotification = e.target.checked;
                setUserData((prev) => {
                  return {
                    ...prev,
                    notification: {
                      pushNotification,
                    },
                  };
                });

                if (!pushNotification) return;
                subscribe();
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              پیامک
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ارسال اعلان‌ها از طریق پیامک
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register?.("smsNotification")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>

          <button
            type="button"
            onClick={async () => {
              const response = await fetch("/api/send-notification", {
                method: "POST",
                body: JSON.stringify({ message: "سلام چطوری سحاب؟" }),
              });
            }}
          >
            send notif
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsEdit;
