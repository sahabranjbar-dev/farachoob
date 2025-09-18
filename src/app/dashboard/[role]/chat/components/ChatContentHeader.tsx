"use client";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useChat } from "../../../../../../stores";

const ChatContentHeader = () => {
  const { setUserInfo, userInfo, setDashboardChatMessage } = useChat();

  return (
    <div className="flex items-center justify-between p-2 border-b bg-indigo-500 text-white">
      <div>
        <XIcon
          onClick={() => {
            setUserInfo(null);
            setDashboardChatMessage([]);
          }}
        />
      </div>

      <div>
        <span>{userInfo?.email || userInfo?.firstName || "کاربر میهمان"}</span>
      </div>

      <div className="rounded-full w-15 h-15 overflow-hidden border">
        <Image
          src={userInfo?.image || "/images/placeholder.png"}
          alt="User Avatar"
          width={60}
          height={60}
          className="object-cover object-center w-full h-full"
        />
      </div>
    </div>
  );
};

export default ChatContentHeader;
