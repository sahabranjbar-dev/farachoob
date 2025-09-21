"use client";

import { emitSocket } from "@/lib/socket";
import { getNotificationSound } from "@/lib/sounds";
import { User } from "@/types/common";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useChat } from "../../../../stores";
import { fetchConvs } from "../[role]/chat/meta/utils";

const notificationSound = getNotificationSound();

export default function DashboardClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const pathname = usePathname();
  const socket = useChat((state) => state.socket);
  const setOnlineUsers = useChat((state) => state.setOnlineUsers);
  const conversation = useChat((state) => state.conversation);

  useEffect(() => {
    if (!user?.id) return;

    // اعلام آنلاین بودن
    emitSocket("user-online", user.id);

    // دریافت لیست آنلاین‌ها
    socket.on("online-users-list", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      emitSocket("user-offline", user.id);
      socket.disconnect();
    };
  }, [socket, user?.id]);

  const notificationSound = getNotificationSound();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered"))
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("get-new-message-notification", (data) => {
      if (data.senderId === user?.id || conversation?.id) return;
      notificationSound?.play();
      const alertMessage = () => {
        const firstName = data?.sender?.firstName;
        const lastName = data?.sender?.lastName;

        if (firstName && lastName) {
          return `شما یک پیام جدید از ${firstName} ${lastName} دریافت کردید`;
        } else if (firstName) {
          return `شما یک پیام جدید از ${firstName} دریافت کردید`;
        } else {
          return "شما یک پیام جدید دریافت کردید";
        }
      };

      toast.info(alertMessage(), {
        position: "top-center",
      });

      if (!pathname.includes("chat")) return;
      fetchConvs();
    });

    return () => {
      socket.off("get-new-message-notification");
    };
  }, [socket, conversation?.id, pathname]);

  useEffect(() => {
    const joinRequestHandler = ({
      toUserId,
      fromUserId,
      conversationId,
      fromUserName,
    }: {
      toUserId: string;
      fromUserId: string;
      conversationId: string;
      fromUserName: string;
    }) => {
      console.log("join-conversation-request", user?.id, toUserId);

      if (user?.id !== toUserId) return;
      notificationSound?.play();
      toast.info(`یوزر ${fromUserName} درخواست شروع چت ارسال کرد`, {
        position: "top-center",
      });
    };

    socket.on("join-conversation-request", joinRequestHandler);

    return () => {
      socket.off("join-conversation-request", joinRequestHandler);
    };
  }, [socket]);

  return <>{children}</>;
}
