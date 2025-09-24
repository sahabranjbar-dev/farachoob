"use client";
import React, { useState, useEffect } from "react";
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
  const { isPushSupported } = useSubscribe(); // اضافه کردن این خط

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pushSupported, setPushSupported] = useState(true);

  // بررسی پشتیبانی مرورگر هنگام mount
  useEffect(() => {
    setPushSupported(isPushSupported());
  }, [isPushSupported]);

  // -------------------------
  // فعال کردن پوش
  // -------------------------
  const handleEnablePush = async () => {
    if (!userData?.id) {
      toast.error("کاربر شناسایی نشد");
      return;
    }

    // بررسی نهایی پشتیبانی مرورگر
    if (!pushSupported) {
      toast.error("مرورگر شما از اعلان‌های Push پشتیبانی نمی‌کند");
      setShowConfirmModal(false);
      return;
    }

    setLoading(true);
    try {
      const result = await subscribe({ userId: userData.id });

      if (result?.error) {
        toast.error(
          result.error === "Permission denied"
            ? "اجازه نوتیفیکیشن داده نشد"
            : "فعال‌سازی اعلان با مشکل مواجه شد"
        );
        return;
      }

      if (result?.success) {
        toast.success("اعلان مرورگر با موفقیت فعال شد");
        setUserData((prev) => ({
          ...prev,
          notification: {
            ...prev.notification,
            pushNotification: true,
          },
        }));
      } else {
        toast.error("فعال‌سازی اعلان با مشکل مواجه شد");
      }

      setShowConfirmModal(false);
    } catch (err: unknown) {
      console.error("Error enabling push:", err);
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "خطا در فعال‌سازی اعلان");

      // در صورت خطا، وضعیت را false نگه دار
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
  // غیرفعال کردن پوش
  // -------------------------
  const handleDisablePush = async () => {
    setUserData((prev) => ({
      ...prev,
      notification: {
        ...prev.notification,
        pushNotification: false,
      },
    }));
    toast.success("اعلان‌های Push غیرفعال شد");
  };

  // -------------------------
  // تغییر وضعیت push toggle
  // -------------------------
  const handlePushToggle = (open: boolean) => {
    // اگر در حال غیرفعال کردن هست (تیک روشنه و کلیک میکنه)
    if (userData?.notification?.pushNotification && !open) {
      handleDisablePush();
      return;
    }

    // اگر در حال فعال کردن هست (تیک خاموشه و کلیک میکنه)
    if (!userData?.notification?.pushNotification && open) {
      // اگر مرورگر پشتیبانی نمی‌کند
      if (!pushSupported) {
        toast.error("مرورگر شما از اعلان‌های Push پشتیبانی نمی‌کند");
        return;
      }

      // اگر subscription وجود دارد، مستقیماً فعال کن
      if (subscription?.endpoint) {
        setUserData((prev) => ({
          ...prev,
          notification: {
            ...prev.notification,
            pushNotification: true,
          },
        }));
        toast.success("اعلان‌های Push فعال شد");
        return;
      }

      // در غیر این صورت دیالوگ فعال‌سازی رو نشون بده
      setShowConfirmModal(true);
    }
  };

  // اگر مرورگر پشتیبانی نمی‌کند، کامپوننت push را غیرفعال نشان بده
  if (!pushSupported) {
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* پوش نوتیفیکیشن (غیرفعال) */}
          <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-600 rounded-lg opacity-60 cursor-not-allowed">
            <div>
              <h3 className="font-medium text-gray-600 dark:text-gray-400">
                اعلان‌های Push
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                این قابلیت در مرورگر شما پشتیبانی نمی‌شود
              </p>
            </div>
            <div className="relative inline-flex items-center">
              <div className="w-11 h-6 bg-gray-300 rounded-full">
                <div className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white border border-gray-300"></div>
              </div>
            </div>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
            {subscription?.endpoint && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ اعلان‌ها فعال شده‌اند
              </p>
            )}
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
                  <br />
                  <span className="text-orange-600 font-medium">
                    لطفاً اجازه نمایش نوتیفیکیشن را در مرورگر تأیید کنید.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setShowConfirmModal(false)}
                  disabled={loading}
                >
                  انصراف
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleEnablePush}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-4 h-4 ml-2" />
                  ) : null}
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
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationsEdit;
