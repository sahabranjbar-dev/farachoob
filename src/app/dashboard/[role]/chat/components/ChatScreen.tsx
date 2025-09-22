"use client";

import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatContentHeader from "./ChatContentHeader";
import { useChat } from "../../../../../../stores";
import { Loader } from "lucide-react";

const ChatScreen = () => {
  const userInfo = useChat((state) => state.userInfo);
  const getConversatioMessageLoading = useChat(
    (state) => state.getConversatioMessageLoading
  );

  if (getConversatioMessageLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        لطفا یک چت انتخاب کنید
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full relative bg-gradient-to-b from-gray-50 to-white">
      <ChatContentHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatScreen;
