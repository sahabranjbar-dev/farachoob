"use client";

import clsx from "clsx";
import { UsersRound } from "lucide-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useChat } from "../../../../../../stores";
import { useSession } from "next-auth/react";

interface Props {}

const ChatSideBar = ({ children }: PropsWithChildren<Props>) => {
  const [open, setOpen] = useState<boolean>(true);

  const { socket, setOnlineUsers, onlineUsers } = useChat();

  const session = useSession();

  const userId = session.data?.user.id;

  const getOnlineUsers = (newUserId: string) => {
    if (!onlineUsers.includes(newUserId)) {
      return [...onlineUsers, newUserId];
    }
    return onlineUsers;
  };

  useEffect(() => {
    if (!socket || !userId) return;

    // اطلاع به سرور درباره آنلاین بودن کاربر
    socket.emit("user-online", userId);

    // دریافت لیست کاربران آنلاین
    socket.emit("get-online-users");

    // گوش دادن به رویدادهای کاربران آنلاین
    socket.on("user-online", (newUserId: string) => {
      const newOnlineUsers = getOnlineUsers(newUserId);
      setOnlineUsers(newOnlineUsers);
    });

    socket.on("user-offline", (offlineUserId: string) => {
      const newOnlineUsers = onlineUsers.filter((id) => id !== offlineUserId);
      setOnlineUsers(newOnlineUsers);
    });

    socket.on("online-users-list", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("user-online");
      socket.off("user-offline");
      socket.off("online-users-list");
    };
  }, [socket, userId]);
  return (
    <div
      className={clsx(
        "h-full border-l transition-all duration-300 flex flex-col",
        open ? "w-1/4" : "w-12"
      )}
    >
      <UsersRound
        onClick={() => setOpen(!open)}
        className="m-2 cursor-pointer"
      />
      {open && (
        <div className="flex-1 h-[calc(100%-40px)] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default ChatSideBar;
