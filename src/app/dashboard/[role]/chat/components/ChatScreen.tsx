"use client";
import React, { useContext } from "react";
import { ChatContext } from "../container/ChatContainer";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatScreen = () => {
  const { conversationId, userInfo } = useContext(ChatContext);

  if (!conversationId || !userInfo) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        لطفا یک چت انتخاب کنید
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="p-2 border-b font-medium">{userInfo.email}</div>
      <div className="flex-1 overflow-y-auto">
        <ChatMessages />
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatScreen;
