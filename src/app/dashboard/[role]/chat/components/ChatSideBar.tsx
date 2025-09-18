"use client";

import clsx from "clsx";
import { ArrowRightFromLine, RefreshCcw, UserRoundSearch } from "lucide-react";
import { useSession } from "next-auth/react";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import useDataGetter from "@/hooks/useDataGetter";
import { Conversation } from "@/types/common";
import { useChat } from "../../../../../../stores";
import { IChatList } from "./ChatList";
import { toast } from "sonner";
import { fetchConvs } from "../meta/utils";

interface Props {
  children: ReactElement<IChatList>;
}

const ChatSideBar = ({ children }: Props) => {
  const {
    socket,
    setOnlineUsers,
    onlineUsers,
    setConversation,
    openSidebar,
    setOpenSidebar,
    setUserInfo,
    setConversations,
    conversations: conversationsData,
  } = useChat();
  const session = useSession();
  const userId = session.data?.user.id;

  const isAdmin = session.data?.user.role?.englishTitle === "admin";

  const { loading: getConversatioLoading, fetch: getConverSations } =
    useDataGetter<{ conversations: Conversation[] }>({
      url: "/dashboard/conversations",
      onSuccess(data) {
        setConversations(data?.conversations);
      },
    });

  useEffect(() => {
    if (!socket || !userId) return;
    socket.emit("get-online-users");

    socket.on("user-online", (newUserId: string) => {
      if (!onlineUsers.includes(newUserId)) {
        setOnlineUsers([...onlineUsers, newUserId]);
      }
    });

    socket.on("user-offline", (offlineUserId: string) => {
      setOnlineUsers(onlineUsers.filter((id) => id !== offlineUserId));
    });

    socket.on("online-users-list", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("user-online");
      socket.off("user-offline");
      socket.off("online-users-list");
    };
  }, [socket, userId, onlineUsers]);

  useEffect(() => {
    if (!socket) return;

    socket.on("admin-recieve-new-message", async (data) => {
      if (isAdmin) {
        fetchConvs().then((data) => {
          toast.info("شما پیام جدید دریافت کردید");
        });
      }
    });

    return () => {
      socket.off("admin-recieve-new-message");
    };
  }, [socket, isAdmin, setConversations]);

  return (
    <div
      className={clsx(
        "h-full border-r transition-all duration-300 flex flex-col bg-gray-50",
        openSidebar ? "w-72" : "w-16"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-3 border-b bg-blue-100">
        <div className="flex gap-1">
          {/* Toggle button */}
          <span
            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <ArrowRightFromLine
              className={clsx(
                "cursor-pointer hover:scale-110 transition-transform",
                {
                  "rotate-180": !openSidebar,
                }
              )}
            />
          </span>

          {/* Refresh button */}
          {openSidebar && (
            <span
              className="p-2 cursor-pointer rounded-lg hover:bg-gray-100"
              onClick={() => {
                if (!getConversatioLoading) {
                  setUserInfo(null);
                  getConverSations?.({});
                }
              }}
            >
              <RefreshCcw
                className={clsx("transition-transform duration-200", {
                  "animate-spin text-gray-400": getConversatioLoading,
                })}
              />
            </span>
          )}
        </div>

        {/* Search */}
        {openSidebar && (
          <span>
            <UserRoundSearch className="cursor-pointer hover:scale-110 transition-transform" />
          </span>
        )}
      </div>

      {/* Chat List */}

      <div className="flex-1 overflow-y-auto">
        {cloneElement(children, {
          getConversatioLoading,
          conversationsData,
        })}
      </div>
    </div>
  );
};

export default ChatSideBar;
