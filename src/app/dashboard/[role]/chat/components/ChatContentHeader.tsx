"use client";
import React, { useContext } from "react";
import { ChatContext } from "../container/ChatContainer";
import { XIcon } from "lucide-react";
import Image from "next/image";

const ChatContentHeader = () => {
  const { userInfo, setUserInfo } = useContext(ChatContext);
  console.log({ userInfo });

  return (
    <div className="flex items-center justify-between p-2 border-b bg-indigo-500 text-white">
      <div>
        <XIcon onClick={() => setUserInfo(null)} />
      </div>

      <div>
        <span>{userInfo?.email}</span>
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
