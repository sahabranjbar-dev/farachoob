"use client";
import useDataGetter from "@/hooks/useDataGetter";
import { Message } from "@/types/common";
import clsx from "clsx";
import {
  Check,
  CheckCheck,
  Clock,
  MessageCircleWarning,
  RotateCcw,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef } from "react";
import { useChat } from "../../../../../../stores";

const ChatMessages = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLLIElement | null>(null);
  const session = useSession();

  const { conversation, setMessages, socket, messages, postMessage } =
    useChat();

  const conversationId = conversation?.id;

  const userId = session.data?.user.id;

  const { loading: getMessageLoading } = useDataGetter<Message[]>({
    url: `/dashboard/conversations/${conversationId}/messages`,
    method: "GET",
    onSuccess(data) {
      setMessages(data);
    },
  });

  const { fetch: updateMessage } = useDataGetter({
    url: `/dashboard/conversations/${conversationId}/messages`,
    method: "PUT",
    immediatelyFetch: false,
  });

  const getMessages = (data: Message) => {
    if (messages.length === 0) return [data];

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.loading && lastMessage.content === data.content) {
      return [...messages.slice(0, -1), { ...data, loading: false }];
    }
    return [...messages, data];
  };
  // Handle incoming new messages
  useEffect(() => {
    const handleNewMessage = (data: Message) => {
      const messages = getMessages(data);

      setMessages(messages);
    };

    socket?.on("new-message", handleNewMessage);
    return () => {
      socket?.off("new-message", handleNewMessage);
    };
  }, [socket]);

  // Compute unread messages
  const isUnReadMessages = useMemo(
    () =>
      messages.filter(
        (msg) => !msg.read && msg.senderId !== userId && !msg.loading
      ),
    [messages, userId]
  );

  const lastIdOfUnReadMessages = useMemo(
    () =>
      isUnReadMessages.length > 0
        ? isUnReadMessages[isUnReadMessages.length - 1]?.id
        : isUnReadMessages[0]?.id,
    [isUnReadMessages]
  );

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!messageRef.current || !lastIdOfUnReadMessages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          socket?.emit("mark-read", {
            conversationId: conversationId,
            userId,
            messageId: lastIdOfUnReadMessages,
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(messageRef.current);
    return () => observer.disconnect();
  }, [socket, conversationId, userId, lastIdOfUnReadMessages]);

  // Handle message read from socket
  const getNewMessages = (messageId: string) => {
    return messages.map((msg) =>
      msg.id === messageId ? { ...msg, read: true } : msg
    );
  };
  const renderStatus = (message: Message) => {
    const isOwnMessage = message.senderId === userId;

    if (message.failed) return <MessageCircleWarning />;
    if (message.loading) {
      if (!isOwnMessage) return null;
      return <Clock size={20} className="opacity-70" />;
    }

    if (message.read) {
      if (!isOwnMessage) return null;
      return <CheckCheck size={20} className="opacity-70" />;
    }

    return <Check size={20} className="opacity-70" />;
  };
  useEffect(() => {
    const handleMessageRead = ({
      conversationId: convId,
      userId: readerId,
      messageId,
    }: {
      conversationId: string;
      userId: string;
      messageId: string;
    }) => {
      if (convId !== conversationId || !readerId || !messageId) return;

      updateMessage?.({
        inputBody: { id: messageId, read: true },
      }).then((data) => {
        if (data.ok) {
          const newMessages = getNewMessages(messageId);
          setMessages(newMessages);
        }
      });
    };

    socket?.on("message-read", handleMessageRead);
    return () => {
      socket?.off("message-read", handleMessageRead);
    };
  }, [socket, conversationId, updateMessage]);

  if (getMessageLoading) {
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
    <ul className="p-4">
      {messages.map((msg, index) => {
        const date = new Date(msg?.createdAt ?? "");
        const time = `${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        const isOwnMessage = msg.senderId === userId;

        const lasMessageRead =
          msg.id === lastIdOfUnReadMessages &&
          !msg.read &&
          msg.senderId !== userId;
        return (
          <li
            ref={
              msg.id === lastIdOfUnReadMessages &&
              !msg.read &&
              msg.senderId !== userId
                ? messageRef
                : undefined
            }
            key={msg.id || `${msg.content}-${index}`}
            className={clsx(
              "rounded-2xl w-fit p-3 m-1 relative",
              isOwnMessage
                ? msg.failed
                  ? "bg-red-500 text-white"
                  : "bg-indigo-500 ml-auto text-white"
                : "bg-gray-200 mr-auto text-black",
              {}
            )}
          >
            <div
              dir="auto"
              className="break-words whitespace-pre-wrap text-inherit"
            >
              {msg.content}
            </div>

            <div className="flex justify-end items-center gap-2">
              <span className="opacity-75 text-sm">
                {msg.loading ? undefined : time}
              </span>
              <span>{renderStatus(msg)}</span>
            </div>
            <div
              className="absolute -left-8 top-[50%] cursor-pointer"
              onClick={() => {
                postMessage({
                  content: msg.content,
                });
              }}
            >
              {msg.failed && isOwnMessage && (
                <RotateCcw
                  color="gray"
                  className="hover:-rotate-180 transition-transform duration-200"
                />
              )}
            </div>
          </li>
        );
      })}
      <div ref={lastMessageRef} />
    </ul>
  );
};

export default ChatMessages;
