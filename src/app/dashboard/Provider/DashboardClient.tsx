"use client";

import { emitSocket } from "@/lib/socket";
import { User } from "@/types/common";
import { useEffect } from "react";
import { useChat } from "../../../../stores";

export default function DashboardClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const socket = useChat((state) => state.socket);
  const setOnlineUsers = useChat((state) => state.setOnlineUsers);

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

  return <>{children}</>;
}
