"use client";

import useDataGetter from "@/hooks/useDataGetter";
import { Conversation } from "@/types/common";
import clsx from "clsx";
import { ArrowRightFromLine, RefreshCw } from "lucide-react";
import { cloneElement, ReactElement, useEffect } from "react";
import { useChat } from "../../../../../../stores";
import { IChatList } from "./ChatList";
import SearchUserChat from "./SearchUserChat";
import { useSession } from "next-auth/react";
import { emitSocket } from "@/lib/socket";
import { toast } from "sonner";
import { fetchConvs } from "../meta/utils";
import { notificationSound } from "@/lib/sounds";

interface Props {
  children: ReactElement<IChatList>;
}

const ChatSideBar = ({ children }: Props) => {
  const setOpenSidebar = useChat((state) => state.setOpenSidebar);
  const openSidebar = useChat((state) => state.openSidebar);
  const setUserInfo = useChat((state) => state.setUserInfo);
  const conversation = useChat((state) => state.conversation);
  const setConversations = useChat((state) => state.setConversations);
  const conversations = useChat((state) => state.conversations);
  const socket = useChat((state) => state.socket);

  const session = useSession();

  const user = session.data?.user;

  const isAdmin = user?.role?.englishTitle === "admin";

  const conversationsData = conversations;

  const { loading: getConversatioLoading, fetch: getConverSations } =
    useDataGetter<{ conversations: Conversation[] }>({
      url: "/dashboard/conversations",
      onSuccess(data: { conversations: Conversation[] }) {
        setConversations(data?.conversations);
      },
      params: {
        isSecure: true,
      },
    });

  useEffect(() => {
    const updateSidebar = () => {
      setOpenSidebar((window.visualViewport?.width ?? 500) > 800);
    };

    updateSidebar(); // بار اول چک کن
    window.visualViewport?.addEventListener("resize", updateSidebar);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateSidebar);
    };
  }, [setOpenSidebar]);

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

  useEffect(() => {
    if (!socket) return;

    socket.on("get-new-message-notification", (data) => {
      if (data.senderId === user?.id || conversation?.id) return;
      notificationSound.play();
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

      fetchConvs();
    });

    return () => {
      socket.off("get-new-message-notification");
    };
  }, [socket, conversation?.id]);

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
                  getConverSations?.({
                    inputParams: {
                      isSecure: true,
                    },
                  });
                }
              }}
            >
              <RefreshCw
                className={clsx("transition-transform duration-200", {
                  "animate-spin text-gray-400 spin-in": getConversatioLoading,
                })}
              />
            </span>
          )}
        </div>

        {/* Search */}
        {openSidebar && (
          <span>
            <SearchUserChat />
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
