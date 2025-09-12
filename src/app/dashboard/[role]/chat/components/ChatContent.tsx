import React from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatContentHeader from "./ChatContentHeader";

const ChatContent = () => {
  return (
    <div className="flex-1 border flex flex-col h-full relative">
      <ChatContentHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatContent;
