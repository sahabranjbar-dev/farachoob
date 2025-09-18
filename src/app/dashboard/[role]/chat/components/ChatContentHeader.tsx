"use client";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useChat } from "../../../../../../stores";

const ChatContentHeader = () => {
  const { setUserInfo, userInfo, setDashboardChatMessage, setConversation } =
    useChat();

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow">
      <XIcon
        className="cursor-pointer hover:scale-110 transition-transform"
        onClick={() => {
          setUserInfo(null);
          setDashboardChatMessage([]);
          setConversation(null);
        }}
      />

      <div className="flex flex-col items-center">
        <span className="font-medium">
          {userInfo?.email || userInfo?.firstName || "کاربر میهمان"}
        </span>
        <span className="text-xs text-indigo-100">آنلاین</span>
      </div>

      <div className="rounded-full w-12 h-12 overflow-hidden border-2 border-white shadow-md">
        <Image
          src={userInfo?.image || "/images/placeholder.png"}
          alt="User Avatar"
          width={60}
          height={60}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default ChatContentHeader;
