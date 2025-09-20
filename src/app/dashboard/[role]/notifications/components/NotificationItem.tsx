"use client";
import React, { useMemo } from "react";
import { INotificationItem } from "../meta/types";
import {
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  MessageCircle,
  Package,
  Loader2,
} from "lucide-react";
import useDataGetter from "@/hooks/useDataGetter";
import clsx from "clsx";
import { fetchInitialNotificationCount } from "../../../../../../stores/notificationStore";

export const typeIconMap: Record<string, React.ReactNode> = {
  INFO: <Info className="text-blue-500" />,
  SUCCESS: <CheckCircle className="text-green-500" />,
  WARNING: <AlertTriangle className="text-yellow-500" />,
  ERROR: <XCircle className="text-red-500" />,
  MESSAGE: <MessageCircle className="text-indigo-500" />,
  ORDER: <Package className="text-purple-500" />,
};
const NotificationItem = ({
  id,
  isRead,
  message,
  createdAt,
  iconType,
  title,
}: INotificationItem) => {
  const {
    data: updateData,
    fetch: update,
    loading: updateLoading,
  } = useDataGetter({
    url: "/dashboard/notifications",
    method: "PUT",
    immediatelyFetch: false,
    showError: true,
    showSuccessMessage: true,
  });

  const isNotificationRead = useMemo(() => {
    if (updateData?.id) {
      return updateData?.isRead;
    }
    return isRead;
  }, [updateData?.isRead]);

  const renderCreatedAt = useMemo(() => {
    if (!createdAt) return "";

    const rawCreatedAt = new Date(createdAt);

    const localeDate = rawCreatedAt.toLocaleDateString();
    const localeTime = rawCreatedAt.toLocaleTimeString();

    return `${localeTime} - ${localeDate}`;
  }, [createdAt]);

  const markAsReadNotification = () => {
    update?.({
      inputBody: {
        isRead: true,
      },
      inputParams: {
        id,
      },
    }).then((data) => {
      if (data.id) fetchInitialNotificationCount();
    });
  };

  return (
    <li
      key={id}
      className={clsx(
        "flex items-start gap-4 p-4 rounded-lg border relative",
        isNotificationRead ? "bg-gray-50" : "bg-white shadow-md border-gray-200"
      )}
    >
      {updateLoading && (
        <div className="flex justify-center items-center absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] w-full h-full backdrop-blur-sm">
          <Loader2 className="animate-spin text-orange-500 " />
        </div>
      )}
      <div className="mt-1">{typeIconMap[iconType ?? "INFO"]}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">{title}</h2>
          {!isNotificationRead && (
            <button
              onClick={markAsReadNotification}
              className="text-sm text-blue-500 hover:underline"
            >
              علامت خوانده شده
            </button>
          )}
        </div>
        <p className="text-gray-700">{message}</p>
        {renderCreatedAt && (
          <p className="text-xs text-gray-400 mt-1">{renderCreatedAt}</p>
        )}
      </div>
    </li>
  );
};

export default NotificationItem;
