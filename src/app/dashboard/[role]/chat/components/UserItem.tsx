"use client";
import React, { useContext } from "react";
import { ChatContext } from "../container/ChatContainer";
import { io } from "socket.io-client";
import prisma from "@/lib/prisma";
import useDataGetter from "@/hooks/useDataGetter";
import { useSocket } from "../container/SocketContainer";

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

export interface Conversation {
  id: string;
  title: any;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
}

export interface Participant {
  userId: string;
}

const UserItem = ({ user }: Props) => {
  const { setUserInfo, setConversationId, setLoading } =
    useContext(ChatContext);

  const { socket } = useSocket();

  const { fetch } = useDataGetter<Conversation>({
    url: "/dashboard/conversations",
    method: "POST",
    immediatelyFetch: false,
  });

  const handleClick = () => {
    setUserInfo(user);
    setLoading(true);

    fetch?.({ inputBody: { participantId: user.id } })
      .then((data) => {
        if (data.id) {
          socket.emit("join-conversation", { conversationId: data.id }); // مهم: مستقیم اینجا emit کنیم
          setConversationId(data.id);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      onClick={() => {
        handleClick();
      }}
      className="p-2 border-b cursor-pointer hover:bg-gray-100"
    >
      {user.email}
    </div>
  );
};

export default UserItem;
