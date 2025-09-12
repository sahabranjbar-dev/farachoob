"use client";
import React, { useContext } from "react";
import { ChatContext } from "../container/ChatContainer";

export interface User {
  id: string;
  email: string | null;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
  nationalId: string | null;
  birthDate: Date | null;
  mobile: string | null;
  isActive: boolean;
  isVerified: boolean;
  image: string | null;
  roleId: string;
  createdAt: Date;
}

interface Props {
  user: User;
}

const UserItem = ({ user }: Props) => {
  const { setUserInfo, setConversationId } = useContext(ChatContext);

  const handleClick = async () => {
    setUserInfo(user);

    // صدا زدن API برای گرفتن/ساخت کانورسیشن
    const res = await fetch("/api/dashboard/conversations", {
      method: "POST",
      body: JSON.stringify({ participantId: user.id }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setConversationId(data.id);
  };

  return (
    <div
      onClick={handleClick}
      className="p-2 border-b cursor-pointer hover:bg-gray-100"
    >
      {user.email}
    </div>
  );
};

export default UserItem;
