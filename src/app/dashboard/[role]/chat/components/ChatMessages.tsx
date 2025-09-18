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
import { useEffect, useRef, useMemo } from "react";
import { useChat } from "../../../../../../stores";
import { markMessagesRead } from "@/lib/utils";
import { fetchConvs } from "../meta/utils";

const ChatMessages = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();

  const {
    conversation,
    socket,
    messages,
    setDashboardChatMessage,
    getConversatioMessageLoading,
  } = useChat();

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

  // دریافت پیام‌های جدید از socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: Message) => {
      setDashboardChatMessage((prev) => [...prev, data]);
    };

    socket.on("new-message-to-admin", handleNewMessage);
    return () => {
      socket.off("new-message-to-admin", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    if (!socket) return;
    const handleNewMessage = (data: {
      conversationId: string;
      messageId: string;
      userId: string;
    }) => {
      const messageId = data?.messageId;
      setDashboardChatMessage((prev) => {
        const resolvedMessage = markMessagesRead(prev, messageId);
        return resolvedMessage;
      });
    };

    socket.on("sticky-read-message", handleNewMessage);
    return () => {
      socket.off("sticky-read-message", handleNewMessage);
    };
  }, [socket, setDashboardChatMessage]);

  // scroll خودکار به آخر چت
  useEffect(() => {
    const chatContainer = lastMessageRef.current?.parentElement;
    if (!chatContainer) return;

    const atBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop <=
      chatContainer.clientHeight + 50;

    if (atBottom) {
      requestAnimationFrame(() => {
        lastMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }
  }, [messages]);

  // پیام‌های unread
  const unreadMessages = useMemo(
    () =>
      messages.filter(
        (msg) => !msg.read && msg.senderId !== userId && !msg.loading
      ),
    [messages, userId]
  );

  const lastUnreadId = unreadMessages.length
    ? unreadMessages[unreadMessages.length - 1]?.id
    : null;

  const unreadRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
  const readMessages = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!lastUnreadId) return;
    if (readMessages.current.has(lastUnreadId)) return;

    const el = unreadRefs.current[lastUnreadId];
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          updateMessage?.({
            inputBody: { id: lastUnreadId },
          }).then((data) => {
            socket?.emit("sticky-mark-read", {
              conversationId,
              userId,
              messageId: lastUnreadId,
            });
            fetchConvs();

            readMessages.current.add(lastUnreadId);

            observer.disconnect();
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [socket, conversationId, userId, lastUnreadId]);

  // render وضعیت پیام
  const renderStatus = (msg: Message) => {
    const isOwn = msg.senderId === userId;
    if (msg.failed) return <MessageCircleWarning />;
    if (msg.loading && isOwn)
      return <Loader size={20} className="animate-spin" />;
    if (msg.read && isOwn)
      return <CheckCheck size={20} className="opacity-70" />;
    if (isOwn) return <Check size={20} className="opacity-70" />;
    return null;
  };

  // ارسال مجدد پیام failed
  const handleRetry = async (msg: Message) => {
    try {
      setDashboardChatMessage((prev) =>
        prev.map((m) =>
          m.tempId === msg.tempId ? { ...m, loading: true, failed: false } : m
        )
      );

      await postMessage?.({
        inputBody: { content: msg.content },
      });

      setDashboardChatMessage((prev) =>
        prev.map((m) =>
          m.tempId === msg.tempId ? { ...m, loading: false } : m
        )
      );
    } catch (err) {
      console.error("Failed to resend message:", err);
      setDashboardChatMessage((prev) =>
        prev.map((m) =>
          m.tempId === msg.tempId ? { ...m, failed: true, loading: false } : m
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

  if (!messages.length) {
    return (
      <div className="flex justify-center items-center h-full">
        پیامی وجود ندارد
      </div>
    );
  }

  return (
    <ul className="p-4 overflow-y-auto max-h-[500px]">
      {messages.map((msg, index) => {
        const date = new Date(msg?.createdAt ?? "");
        const time = `${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        const isOwn = msg.senderId === userId;

        return (
          <li
            key={msg.id || msg.tempId || `${msg.content}-${index}`}
            ref={(el) => {
              if (msg.id === lastUnreadId)
                unreadRefs.current[msg.id ?? ""] = el;
            }}
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
