"use client";
import useTabular from "@/hooks/useTabular";
import { Bell, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import {
  fetchInitialNotificationCount,
  useNotification,
} from "../../stores/notificationStore";
import { toast } from "sonner";
import { useChat } from "../../stores";
import { getNotificationSound } from "@/lib/sounds";

const NotificationIcon = () => {
  const { open } = useTabular();
  const socket = useChat((state) => state.socket);

  const notificationCount = useNotification((state) => state.notificationCount);
  const addNewNotification = useNotification(
    (state) => state.addNewNotification
  );

  const notificationSound = getNotificationSound();

  useEffect(() => {
    const addNewNotificationHandler = ({ toUserId }: { toUserId: string }) => {
      notificationSound?.play();
      toast.info("اعلان جدید دریافت کرده‌اید", {
        position: "top-center",
      });
      addNewNotification();
    };

    socket.on("add-new-notificaiton", addNewNotificationHandler);

    return () => {
      socket.off("add-new-notificaiton");
    };
  }, [socket]);

  useEffect(() => {
    fetchInitialNotificationCount();
  }, [fetchInitialNotificationCount]);

  return (
    <div
      className="flex items-center gap-2 ml-2 pl-2 relative"
      onClick={() => {
        open("/notifications", "اعلان‌ها");
      }}
    >
      <Bell
        className="hover:bg-gray-200 cursor-pointer transition-colors duration-150  rounded-full p-2"
        size={45}
      />

      {!!notificationCount && (
        <div className="absolute bottom-0 right-0 rounded-full bg-blue-500 w-4 h-4 flex justify-center items-center text-white/80">
          <span className="text-sm">{notificationCount}</span>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
