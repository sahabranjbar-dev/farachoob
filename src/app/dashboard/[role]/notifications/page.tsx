"use client";
import useDataGetter from "@/hooks/useDataGetter";
import { Notifications } from "@/types/common";
import clsx from "clsx";
import { Inbox, Loader2, RotateCw, XCircle } from "lucide-react";
import NotificationItem from "./components/NotificationItem";

const NotificationsPage = () => {
  const { data, error, fetch, loading } = useDataGetter<Notifications[]>({
    url: "/dashboard/notifications",
  });

  return (
    <div className="p-6 max-w-3xl mx-auto border rounded-xl bg-white shadow-2xl">
      <div className="flex justify-start items-center gap-4 m-2 p-2">
        <h1 className="text-2xl font-bold">اعلان‌ها</h1>
        <RotateCw
          className={clsx(
            loading
              ? "cursor-not-allowed text-gray-500 animate-spin"
              : "text-blue-500 hover:rotate-180 transition-transform duration-300 "
          )}
          onClick={() => {
            if (loading) return;
            fetch?.({});
          }}
        />
      </div>

      <ul className="space-y-4 min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center py-10">
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
  );
};

export default NotificationsPage;
