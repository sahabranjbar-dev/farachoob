"use client";

import { useEffect } from "react";
import { useChat } from "../../../../stores";
import { User } from "@/types/common";
import { toast } from "sonner";
import { fetchConvs } from "../[role]/chat/meta/utils";
import { emitSocket } from "@/lib/socket";

export default function DashboardClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const socket = useChat((state) => state.socket);
  const setOnlineUsers = useChat((state) => state.setOnlineUsers);

  const isAdmin = user.role?.englishTitle === "admin";
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

  useEffect(() => {
    if (!socket) return;

    socket.on("get-new-message-notification", (data) => {
      if (data.senderId === user?.id) return;
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

      toast.info(alertMessage());

      fetchConvs();
    });

    return () => {
      socket.off("get-new-message-notification");
    };
  }, [socket]);

  useEffect(() => {
    if (!isAdmin) return;

    const handler = (data: { conversationId: string }) => {
      emitSocket("join-conversation", {
        conversationId: data.conversationId,
      });
    };

    socket.on("admin-join-conversation", handler);

    return () => {
      socket.off("admin-join-conversation", handler);
    };
  }, [socket, isAdmin]);

  return <>{children}</>;
}
