"use client";

import { Conversation, Message, User } from "@/types/common";
import { useChat } from "../../../../../../stores";
import clsx from "clsx";
import Image from "next/image";
import { useMemo } from "react";

interface Props {
  user: User;
  unReadMessage?: number;
  messages: Message[];
  getConversatioMessages: () => void;
}

const UserItem = ({
  user,
  unReadMessage,
  messages,
  getConversatioMessages,
}: Props) => {
  const lastMessage = messages[0]?.content ?? "بدون پیام";
  const openSidebar = useChat((state) => state.openSidebar);
  const userInfo = useChat((state) => state.userInfo);
  const onlineUsers = useChat((state) => state.onlineUsers);

  const isUserOnline = useMemo(() => {
    if (!Array.isArray(onlineUsers) || !onlineUsers?.length || !user?.id)
      return false;
    return onlineUsers?.includes(user?.id);
  }, [onlineUsers]);

  return (
    <div
      onClick={getConversatioMessages}
      className={clsx(
        "flex items-center relative cursor-pointer hover:bg-gray-100 transition-colors",
        openSidebar ? "gap-3 px-4 py-3" : "justify-center py-2",
        { "bg-indigo-200": userInfo?.id === user.id }
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          "relative flex items-center justify-center rounded-full font-bold bg-gradient-to-tr from-indigo-400 to-purple-400 text-white",
          openSidebar ? "w-10 h-10 text-base" : "w-8 h-8 text-sm"
        )}
      >
        {user.image ? (
          <Image
            alt="user image"
            src={user.image}
            width={openSidebar ? 40 : 32}
            height={openSidebar ? 40 : 32}
            className="rounded-full object-cover"
          />
        ) : (
          user.firstName?.[0] ?? "?"
        )}

        {isUserOnline && (
          <div
            className={clsx(
              " rounded-full bg-green-500 absolute top-0 right-0",
              openSidebar ? "w-3 h-3" : "w-2 h-2"
            )}
          />
        )}
      </div>

      {/* Info */}
      <div
        className={clsx(
          "flex-1 transition-all duration-300 overflow-hidden",
          openSidebar
            ? "opacity-100 max-w-[200px]"
            : "opacity-0 max-w-0 pointer-events-none"
        )}
      >
        <p className="font-medium whitespace-nowrap">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
      </div>

      {/* Unread Badge */}
      {unReadMessage ? (
        <span
          className={clsx(
            "bg-indigo-500 text-white text-xs rounded-full",
            openSidebar ? "px-2 py-1" : "absolute -top-1 -right-1 px-1.5 py-0.5"
          )}
        >
          {unReadMessage}
        </span>
      ) : null}
    </div>
  );
};

export default UserItem;
