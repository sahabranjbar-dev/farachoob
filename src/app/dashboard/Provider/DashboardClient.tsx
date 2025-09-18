"use client";

import { useEffect } from "react";
import { useChat } from "../../../../stores";

export default function DashboardClient({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const { socket } = useChat();

  useEffect(() => {
    if (!socket) return;

    socket.emit("user-online", userId);

    return () => {
      socket.emit("user-offline", userId);
    };
  }, [socket, userId]);

  return <>{children}</>;
}
