"use client";
import React, { useState } from "react";
import { INotificationsEdit } from "../meta/types";
import { useSetting } from "../../../../../../stores/settingStore";
import useSubscribe from "@/hooks/useSubscribe";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

const NotificationsEdit = ({
  register,
  subscription,
  subscribe,
}: INotificationsEdit) => {
  const setUserData = useSetting((state) => state.setUserData);
  const userData = useSetting((state) => state.userData);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // فعال کردن پوش
  // -------------------------
  const handleEnablePush = async () => {
    if (!userData?.id) return;

    setLoading(true);
    try {
      const data = await subscribe({ userId: userData.id });
      if (!data?.success) {
        toast.error("اضافه کردن اعلان مرورگر با مشکل مواجه شد");
        return;
      }

      toast.success("اعلان مرورگر با موفقیت فعال شد");
      setUserData((prev) => ({
        ...prev,
        notification: {
          ...prev.notification,
          pushNotification: true,
        },
      }));
      setShowConfirmModal(false);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error(error.response?.data?.message || error.message);
      toast.error("اضافه کردن اعلان مرورگر با مشکل مواجه شد");

      setUserData((prev) => ({
        ...prev,
        notification: {
          ...prev.notification,
          pushNotification: false,
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // تغییر وضعیت push toggle
  // -------------------------
  const handlePushToggle = (open: boolean) => {
    // اگر subscription هست فقط سوئیچ کن
    if (subscription) {
      setUserData((prev) => ({
        ...prev,
        notification: {
          ...prev.notification,
          pushNotification: !prev.notification?.pushNotification,
        },
      }));
      return;
    }

    // اگر کاربر قبلا فعال کرده باشه و دوباره بزنه یعنی غیر فعال کنه
    if (userData?.notification?.pushNotification) {
      setUserData((prev) => ({
        ...prev,
        notification: {
          ...prev.notification,
          pushNotification: false,
        },
      }));
      return;
    }

    // در غیر این صورت دیالوگ فعال‌سازی رو نشون بده
    setShowConfirmModal(open);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
        تنظیمات اعلان‌ها
      </h2>

      <div className="space-y-4">
        {/* ایمیل */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              ایمیل
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              دریافت اعلان‌ها از طریق ایمیل
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={userData?.notification?.email}
              {...register?.("emailNotification")}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full 
              peer peer-checked:after:translate-x-full peer-checked:after:border-white 
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
              after:bg-white after:border-gray-300 after:border after:rounded-full 
              after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>

        {/* پوش نوتیفیکیشن */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              اعلان‌های Push
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              دریافت اعلان‌ها در مرورگر
            </p>
          </div>

          <AlertDialog open={showConfirmModal} onOpenChange={handlePushToggle}>
            <AlertDialogTrigger asChild>
              <div className="relative inline-flex items-center cursor-pointer">
                <div
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    userData?.notification?.pushNotification
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white border border-gray-300 transition-transform flex items-center justify-center ${
                      userData?.notification?.pushNotification
                        ? "translate-x-full border-white"
                        : ""
                    }`}
                  >
                    {loading && (
                      <Loader2 className="animate-spin w-3 h-3 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>فعال‌سازی اعلان‌ها</AlertDialogTitle>
                <AlertDialogDescription>
                  با فعال کردن اعلان‌های مرورگر، از پیام‌ها و رویدادهای جدید
                  به‌صورت زنده مطلع خواهید شد.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowConfirmModal(false)}>
                  انصراف
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleEnablePush}>
                  ادامه
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* پیامک */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              پیامک
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              دریافت اعلان‌ها از طریق پیامک
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={userData?.notification?.sms}
              {...register?.("smsNotification")}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full 
              peer peer-checked:after:translate-x-full peer-checked:after:border-white 
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
              after:bg-white after:border-gray-300 after:border after:rounded-full 
              after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationsEdit;
