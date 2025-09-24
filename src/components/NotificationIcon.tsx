"use client";
import useTabular from "@/hooks/useTabular";
import { Bell, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useNotification } from "../../stores/notificationStore";
import { toast } from "sonner";
import { useChat } from "../../stores";
import { getNotificationSound } from "@/lib/sounds";
import { fetchInitialNotificationCount } from "@/lib/utils";
import { useSession } from "next-auth/react";

const NotificationIcon = () => {
  const session = useSession();
  const { open } = useTabular();
  const socket = useChat((state) => state.socket);

  const notificationCount = useNotification((state) => state.notificationCount);
  const addNewNotification = useNotification(
    (state) => state.addNewNotification
  );

  const notificationSound = getNotificationSound();

  useEffect(() => {
    const addNewNotificationHandler = ({ toUserId }: { toUserId: string }) => {
      if (session.data?.user.id !== toUserId) return;
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
      className="flex items-center gap-2 ml-2 pl-2 relative cursor-pointer"
      onClick={() => {
        open("/notifications", "اعلان‌ها");
      }}
    >
      <Bell
        className="hover:bg-gray-200 transition-colors duration-150  rounded-full p-2"
        size={45}
      />

      {!!notificationCount && (
        <div className="absolute -bottom-2 -right-[11px] rounded-full bg-blue-700/90 w-8 h-8 flex justify-center items-center text-white">
          <span className="text-sm">
            {notificationCount > 99 ? "+99" : notificationCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
