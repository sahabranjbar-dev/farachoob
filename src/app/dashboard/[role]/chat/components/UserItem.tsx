"use client";
import useDataGetter from "@/hooks/useDataGetter";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../container/ChatContainer";
import { useSocket } from "../container/SocketContainer";
import { useSession } from "next-auth/react";

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
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { setUserInfo, setConversationId, setLoading } =
    useContext(ChatContext);

  const session = useSession();

  const userId = session?.data?.user.id;

  const socket = useSocket();

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
          socket?.emit("join-conversation", { conversationId: data.id }); // مهم: مستقیم اینجا emit کنیم
          setConversationId(data.id);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!socket || !userId) return;

    // اطلاع به سرور درباره آنلاین بودن کاربر
    socket.emit("user-online", userId);

    // دریافت لیست کاربران آنلاین
    socket.emit("get-online-users");

    // گوش دادن به رویدادهای کاربران آنلاین
    socket.on("user-online", (newUserId: string) => {
      setOnlineUsers((prev) => {
        if (!prev.includes(newUserId)) {
          return [...prev, newUserId];
        }
        return prev;
      });
    });

    socket.on("user-offline", (offlineUserId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== offlineUserId));
    });

    socket.on("online-users-list", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("user-online");
      socket.off("user-offline");
      socket.off("online-users-list");
    };
  }, [socket, userId]);

  return (
    <div
      onClick={() => {
        handleClick();
      }}
      className="p-2 border-b cursor-pointer hover:bg-gray-100 flex justify-between items-center gap-2"
    >
      {onlineUsers.includes(user.id) && (
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      )}
      {user.firstName || user.email}
    </div>
  );
};

export default UserItem;
