"use client";

import useDataGetter from "@/hooks/useDataGetter";
import { Conversation } from "@/types/common";
import clsx from "clsx";
import { ArrowRightFromLine, RefreshCw } from "lucide-react";
import { cloneElement, ReactElement, useEffect } from "react";
import { useChat } from "../../../../../../stores";
import { IChatList } from "./ChatList";
import SearchUserChat from "./SearchUserChat";

interface Props {
  children: ReactElement<IChatList>;
}

const ChatSideBar = ({ children }: Props) => {
  const setOpenSidebar = useChat((state) => state.setOpenSidebar);
  const openSidebar = useChat((state) => state.openSidebar);
  const setUserInfo = useChat((state) => state.setUserInfo);
  const setConversations = useChat((state) => state.setConversations);
  const conversations = useChat((state) => state.conversations);

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
