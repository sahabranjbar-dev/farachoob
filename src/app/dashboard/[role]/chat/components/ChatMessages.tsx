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
import { fetchConvs } from "../meta/utils";
import { emitSocket } from "@/lib/socket";
import { recieveMessageSound } from "@/lib/sounds";

const ChatMessages = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const messagesRefs = useRef<(HTMLLIElement | null)[]>([]);
  const observedMessages = useRef(new Set<string>());

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
      if (conversation?.id === data.conversationId) {
        recieveMessageSound.play();
        setDashboardChatMessage((prev) => [...prev, data]);
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, conversation?.id]);

  // هر بار messages تغییر کنه → آخرین پیام اسکرول میشه
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry: any) => {
          const messageId = entry.target?.dataset?.messageId;
          if (
            entry.isIntersecting &&
            !observedMessages.current.has(messageId)
          ) {
            observedMessages.current.add(messageId); // جلوگیری از دوباره خواندن
            updateMessage?.({ inputBody: { id: messageId } }).then((data) => {
              if (data?.ok) {
                fetchConvs(); // اگر خیلی ضروری نیست، می‌تونی حذفش کنی
                emitSocket("message-read", {
                  messageId: data?.updatedMessage?.id,
                  conversationId,
                });
              }
            });
          }
        });
      },
      { root: null, threshold: 0.1 }
    );

    messagesRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, [messages]);

  useEffect(() => {
    const setReadMarkHandler = (data: { messageId?: string }) => {
      setDashboardChatMessage((prev) => {
        const resoledMessage = prev.map((item) => {
          if (item.id !== data?.messageId) return item;
          return { ...item, read: true };
        });
        return resoledMessage;
      });
    };
    socket.on("mark-message-read", setReadMarkHandler);

    return () => {
      socket.off("mark-message-read", setReadMarkHandler);
    };
  }, []);
  function getDirection(text: string): "rtl" | "ltr" {
    if (!text) return "ltr";
    return /[\u0600-\u06FF]/.test(text[0]) ? "rtl" : "ltr";
  }

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
    <div className="flex-1 mb-24 p-4 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-transparent overflow-y-auto">
      <ul className="p-4  max-h-[500px]">
        {messages?.map((msg, index) => {
          const date = new Date(msg?.createdAt ?? "");
          const time = `${date.getHours()}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
          const isOwn = msg.senderId === userId;
          const direction = getDirection(msg.content);
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
              ref={(el) => {
                if (!isOwn && !msg.read) {
                  messagesRefs.current[index] = el;
                }
              }}
              data-message-id={msg.id}
            >
              <div
                className={clsx(
                  "px-1 py-2 rounded-lg break-words whitespace-pre-wrap",
                  direction === "rtl" ? "text-right" : "text-left"
                )}
                style={{ direction }}
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
    </div>
  );
};

export default ChatMessages;
