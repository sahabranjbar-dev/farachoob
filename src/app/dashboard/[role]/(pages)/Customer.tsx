"use client";

import useDataGetter from "@/hooks/useDataGetter";
import { Notifications } from "@/types/common";
import { Bell, Inbox, Loader2, RefreshCcw, XCircle } from "lucide-react";
import NotificationItem from "../notifications/components/NotificationItem";
import PersianCalendar from "@/components/PersianCalender/PersianCalender";
import { useState } from "react";
import clsx from "clsx";

const CustomerDashboard = () => {
  const { data, error, fetch, loading } = useDataGetter<Notifications[]>({
    url: "/dashboard/notifications",
  });

  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="p-6 space-y-6">
      {/* ردیف بالا: نمودار و اعلان‌ها کنار هم */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* اعلان‌ها */}
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Bell size={20} /> اعلان‌ها
            <RefreshCcw
              onClick={() => {
                if (loading) return;
                fetch?.({});
              }}
              className={clsx(
                loading ? "cursor-not-allowed  text-gray-400" : "cursor-pointer"
              )}
            />
          </h2>
          <ul className="space-y-2 overflow-y-scroll h-full">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-10 gap-8">
                <XCircle className="w-12 h-12 mb-2 text-red-500" />
                <div className="text-lg font-medium flex justify-center items-center gap-4">
                  <span className="text-red-500">
                    خطایی رخ داده است. دوباره تلاش کنید.
                  </span>
                </div>
              </div>
            ) : data?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Inbox className="w-12 h-12 mb-2" />
                <p className="text-lg">اعلانی وجود ندارد</p>
              </div>
            ) : (
              data?.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  isRead={notification.isRead}
                  message={notification.message}
                  title={notification.title}
                  createdAt={notification.createdAt}
                  iconType={notification.type}
                />
              ))
            )}
          </ul>
        </div>

        <div className="flex-1">
          <PersianCalendar
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            showTodayButton={true}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
