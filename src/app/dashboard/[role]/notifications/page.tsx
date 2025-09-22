"use client";
import useDataGetter from "@/hooks/useDataGetter";
import { Notifications } from "@/types/common";
import clsx from "clsx";
import { CheckCheck, Inbox, Loader2, RotateCw, XCircle } from "lucide-react";
import NotificationItem from "./components/NotificationItem";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useNotification } from "../../../../../stores/notificationStore";
import { useEffect } from "react";
import { useChat } from "../../../../../stores";

const NotificationsPage = () => {
  const { data: userData } = useSession();

  const userId = userData?.user?.id;

  const setNotificationCount = useNotification(
    (state) => state.setNotificationCount
  );

  const socket = useChat((state) => state.socket);

  const { data, error, fetch, loading } = useDataGetter<Notifications[]>({
    url: "/dashboard/notifications",
  });

  const {
    error: readAllError,
    fetch: realAllUpdate,
    loading: readAllLoading,
  } = useDataGetter({
    url: "/dashboard/notifications/read-all",
    immediatelyFetch: false,
    method: "PUT",
  });

  const readAllCheckHandler = () => {
    if (readAllLoading || loading) return;
    realAllUpdate?.({
      inputBody: { userId },
    }).then((data) => {
      toast.success(
        `تعداد (${data?.count}) اعلان تغییر وضعیت داده شد به خوانده شده`
      );
      setNotificationCount(0);
      reloadHandler();
    });
  };

  const reloadHandler = () => {
    if (loading || readAllLoading) return;
    fetch?.({});
  };

  const disabled = readAllLoading || loading;

  const showReadAllButton = data?.some((item) => !item.isRead);

  useEffect(() => {
    const addNewNotificationHandler = ({ toUserId }: { toUserId: string }) => {
      if (userId !== toUserId) return;
      reloadHandler();
    };

    socket.on("add-new-notificaiton", addNewNotificationHandler);

    return () => {
      socket.off("add-new-notificaiton");
    };
  }, [socket]);

  return (
    <div className="p-6 max-w-3xl mx-auto border rounded-xl bg-white shadow-2xl">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-4 m-2 p-2">
          <h1 className="text-2xl font-bold">اعلان‌ها</h1>
          <RotateCw
            className={clsx(
              loading
                ? "cursor-not-allowed text-gray-500 animate-spin"
                : "text-blue-500 hover:rotate-180 transition-transform duration-300 "
            )}
            onClick={reloadHandler}
          />
        </div>

        {showReadAllButton && (
          <button
            type="button"
            className={clsx(
              "flex items-center gap-2 text-gray-400 hover:text-gray-700",
              "transition-colors duration-200",
              disabled && "cursor-not-allowed text-gray-200 hover:text-gray-200"
            )}
            onClick={!disabled ? readAllCheckHandler : undefined}
            disabled={disabled}
          >
            <h2 className="text-sm">علامت خوانده شده همه</h2>
            <CheckCheck className="w-5 h-5" />
          </button>
        )}
      </div>

      <ul className="space-y-4 min-h-[200px]">
        {loading || readAllLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
          </div>
        ) : error || readAllError ? (
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
