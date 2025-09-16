"use client";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { ChatContext } from "../container/ChatContainer";
import useDataGetter from "@/hooks/useDataGetter";
import { useSocket } from "../container/SocketContainer";
import { Check, CheckCheck, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import clsx from "clsx";

export interface Message {
  id?: string;
  conversationId?: string;
  senderId?: string;
  content: string;
  metadata?: any;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  delivered?: boolean;
  read?: boolean;
  deleted?: boolean;
  sender?: Sender;
  loading?: boolean;
}

export interface Sender {
  id: string;
  email: string;
  image: any;
}

const ChatMessages = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLLIElement | null>(null);
  const { conversationId, messages, setMessages } = useContext(ChatContext);
  const socket = useSocket();
  const session = useSession();

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

  // Handle incoming new messages
  useEffect(() => {
    const handleNewMessage = (data: Message) => {
      setMessages((prev) => {
        if (prev.length === 0) return [data];

        const lastMessage = prev[prev.length - 1];
        if (lastMessage.loading && lastMessage.content === data.content) {
          return [...prev.slice(0, -1), data];
        }
        return [...prev, data];
      });
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

  // Always scroll to last message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Observe last unread message
  useEffect(() => {
    if (!messageRef.current || !lastIdOfUnReadMessages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          socket?.emit("mark-read", {
            conversationId,
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
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, read: true } : msg
            )
          );
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
              "rounded-2xl w-fit p-3 m-1",
              isOwnMessage
                ? "bg-indigo-500 ml-auto text-white"
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
              <span className="opacity-75 text-sm">
                {msg.loading ? undefined : time}
              </span>
              <span>
                {msg.loading ? (
                  isOwnMessage ? (
                    <Clock size={20} className="opacity-70" />
                  ) : null
                ) : isOwnMessage ? (
                  msg.read ? (
                    <CheckCheck size={20} className="opacity-70" />
                  ) : (
                    <Check size={20} className="opacity-70" />
                  )
                ) : null}
              </span>
            </div>
          </li>
        );
      })}
      <div ref={lastMessageRef} />
    </ul>
  );
};

export default ChatMessages;
