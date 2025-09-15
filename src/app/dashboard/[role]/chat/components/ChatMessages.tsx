"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
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
}

export interface Sender {
  id: string;
  email: string;
  image: any;
}

const ChatMessages = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const { conversationId, messages, setMessages } = useContext(ChatContext);
  const socket = useSocket();
  const session = useSession();

  const userId = session.data?.user.id;

  // get messages API
  const { loading: getMessageLoading } = useDataGetter<Message[]>({
    url: `/dashboard/conversations/${conversationId}/messages`,
    onSuccess(data) {
      setMessages(data);
    },
  });

  useEffect(() => {
    const handleNewMessage = (data: Message) => {
      setMessages((prev) => {
        if (prev.length === 0) return [data];

        const lastMessage = prev[prev.length - 1];

        // اگه آخرین پیام لودینگ بود و کانتنتش همون کانتنت جدیده
        if (lastMessage.loading && lastMessage.content === data.content) {
          // آخرین پیام رو حذف کن و پیام واقعی رو اضافه کن
          return [...prev.slice(0, -1), data];
        }

        // در غیر این صورت فقط پیام جدید رو اضافه کن
        return [...prev, data];
      });
    };

    socket?.on("new-message", handleNewMessage);
    return () => {
      socket?.off("new-message", handleNewMessage);
    };
  }, [socket]);

  // always scroll to last message when messages change
  useEffect(() => {
    if (messages.length > 0) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
    <div className="flex flex-col gap-2 p-2 overflow-y-auto h-full mb-24">
      {messages.map((msg) => {
        const date = new Date(msg?.createdAt ?? "");
        const time = `${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        const isOwnMessage = msg.senderId === userId;

        return (
          <div
            key={msg.id || msg.content}
            className={clsx(
              "p-4 border rounded text-white inline-flex w-fit justify-start items-end gap-2",
              isOwnMessage ? " bg-indigo-500 ml-auto" : " bg-blue-500 mr-auto"
            )}
          >
            <div dir="auto" className="break-words whitespace-pre-wrap">
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
          </div>
        );
      })}
      <div ref={lastMessageRef} />
    </div>
  );
};

export default ChatMessages;
