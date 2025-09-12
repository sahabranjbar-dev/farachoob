"use client";
import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ChatContext } from "../container/ChatContainer";

const socket = io();
type Message = {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
};
const ChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { conversationId } = useContext(ChatContext);

  useEffect(() => {
    if (!conversationId) return;

    // گرفتن پیام‌های قدیمی
    fetch(`/api/conversations/${conversationId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    // جوین شدن به روم مربوط به کانورسیشن
    socket.emit("join-conversations", [conversationId]);

    // گوش دادن به پیام‌های جدید
    socket.on("new-message", (msg: Message) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("new-message");
    };
  }, [conversationId]);

  return (
    <div className="flex flex-col gap-2 p-2 overflow-y-auto h-full">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="p-2 border-b rounded bg-gray-50 text-sm text-gray-800"
        >
          <span className="text-xs text-gray-500 block">
            {msg.senderId} - {new Date(msg.createdAt).toLocaleTimeString()}
          </span>
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
