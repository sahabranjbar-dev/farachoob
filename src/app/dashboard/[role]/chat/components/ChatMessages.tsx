"use client";
import useDataGetter from "@/hooks/useDataGetter";
import { Message } from "@/types/common";
import clsx from "clsx";
import {
  Check,
  CheckCheck,
  Loader,
  MessageCircleWarning,
  RotateCcw,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useChat } from "../../../../../../stores";

const ChatMessages = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();

  const conversation = useChat((s) => s.conversation);
  const socket = useChat((s) => s.socket);
  const messages = useChat((s) => s.messages);
  const setDashboardChatMessage = useChat((s) => s.setDashboardChatMessage);
  const getConversatioMessageLoading = useChat(
    (s) => s.getConversatioMessageLoading
  );

  const conversationId = conversation?.id;
  const userId = session.data?.user.id;

  const { fetch: postMessage } = useDataGetter({
    url: "/dashboard/conversations/messages",
    method: "POST",
    immediatelyFetch: false,
    params: { conversationId },
  });

  const { fetch: updateMessage } = useDataGetter({
    url: "/dashboard/conversations/messages/read",
    method: "PUT",
    immediatelyFetch: false,
    params: { conversationId },
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: Message) => {
      setDashboardChatMessage((prev) => [...prev, data]);
    };

    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket]);

  // render وضعیت پیام
  const renderStatus = (msg: Message) => {
    const isOwn = msg?.senderId === userId;
    if (msg?.failed) return <MessageCircleWarning />;
    if (msg?.loading && isOwn)
      return <Loader size={20} className="animate-spin" />;
    if (msg?.read && isOwn)
      return <CheckCheck size={20} className="opacity-70" />;
    if (isOwn) return <Check size={20} className="opacity-70" />;
    return null;
  };

  // ارسال مجدد پیام failed
  const handleRetry = async (msg: Message) => {
    try {
      setDashboardChatMessage((prev) =>
        prev.map((m) =>
          m?.tempId === msg?.tempId ? { ...m, loading: true, failed: false } : m
        )
      );

      await postMessage?.({
        inputBody: { content: msg.content },
      });

      setDashboardChatMessage((prev) =>
        prev.map((m) =>
          m?.tempId === msg?.tempId ? { ...m, loading: false } : m
        )
      );
    } catch (err) {
      console.error("Failed to resend message:", err);
      setDashboardChatMessage((prev) =>
        prev.map((m) =>
          m?.tempId === msg?.tempId ? { ...m, failed: true, loading: false } : m
        )
      );
    }
  };

  if (getConversatioMessageLoading) {
    return (
      <div className="flex justify-center gap-1 items-center h-full">
        در حال دریافت پیام‌ها
        <div className="animate-caret-blink bg-gray-800 h-1 w-1 rounded-full delay-100"></div>
        <div className="animate-caret-blink bg-gray-800 h-1 w-1 rounded-full delay-200"></div>
        <div className="animate-caret-blink bg-gray-800 h-1 w-1 rounded-full delay-300"></div>
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex justify-center items-center h-full">
        پیامی وجود ندارد
      </div>
    );
  }

  return (
    <ul className="p-4 overflow-y-auto max-h-[500px]">
      {messages?.map((msg, index) => {
        const date = new Date(msg?.createdAt ?? "");
        const time = `${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        const isOwn = msg.senderId === userId;

        return (
          <li
            key={msg.id || msg.tempId || `${msg.content}-${index}`}
            className={clsx(
              "rounded-2xl w-fit p-3 m-1 relative",
              isOwn
                ? msg.failed
                  ? "bg-red-500 text-white"
                  : "bg-indigo-500 ml-auto text-white"
                : "bg-gray-200 mr-auto text-black"
            )}
          >
            <div
              dir="auto"
              className="break-words whitespace-pre-wrap text-inherit"
            >
              {msg.content}
            </div>

            <div className="flex justify-end items-center gap-2">
              {!msg.loading && (
                <span className="opacity-75 text-sm">{time}</span>
              )}
              <span>{renderStatus(msg)}</span>
            </div>

            {msg.failed && isOwn && (
              <div
                className="absolute -left-8 top-[50%] cursor-pointer"
                onClick={() => handleRetry(msg)}
              >
                <RotateCcw
                  color="gray"
                  className="hover:-rotate-180 transition-transform duration-200"
                />
              </div>
            )}
          </li>
        );
      })}
      <div ref={lastMessageRef} />
    </ul>
  );
};

export default ChatMessages;
