"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../container/ChatContainer";
import useDataGetter from "@/hooks/useDataGetter";
import { useSocket } from "../container/SocketContainer";
import { Check, CheckCheck, Clock } from "lucide-react";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  delivered: boolean;
  read: boolean;
  deleted: boolean;
  sender: Sender;
}

export interface Sender {
  id: string;
  email: string;
  image: any;
}

type MessageWithLoading = Message & { loading?: boolean };

const ChatMessages = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const { conversationId } = useContext(ChatContext);
  const { socket } = useSocket();

  const [messages, setMessages] = useState<MessageWithLoading[]>([]);

  // send message API
  const { fetch: postMessage } = useDataGetter<Message>({
    url: `/dashboard/conversations/${conversationId}/messages`,
    immediatelyFetch: false,
    method: "POST",
  });

  // get messages API
  const { loading: getMessageLoading } = useDataGetter<Message[]>({
    url: `/dashboard/conversations/${conversationId}/messages`,
    onSuccess(data) {
      setMessages(data);
    },
  });

  // handle incoming socket messages
  useEffect(() => {
    const handleNewMessage = (data: Message) => {
      // show temporary loading message
      setMessages((prev) => [...prev, { ...data, loading: true }]);

      // call API to persist
      postMessage?.({
        inputBody: { content: data.content },
      }).then((saved) => {
        setMessages((prev) =>
          prev.map((m) => (m.loading && m.content === data.content ? saved : m))
        );
      });
    };

    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, postMessage]);

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
        const date = new Date(msg.createdAt);
        const time = `${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        return (
          <div
            key={msg.id}
            className="p-4 border rounded bg-indigo-500 text-white inline-flex w-fit justify-start items-end gap-2"
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
                  <Clock size={20} className="opacity-70" />
                ) : msg.read ? (
                  <CheckCheck size={20} className="opacity-70" />
                ) : (
                  <Check size={20} className="opacity-70" />
                )}
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
