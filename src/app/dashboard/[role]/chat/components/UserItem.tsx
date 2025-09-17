"use client";
import useDataGetter from "@/hooks/useDataGetter";
import { User } from "@/types/common";
import { useChat } from "../../../../../../stores";
import { PostConverSationData } from "../meta/types";

interface Props {
  user: User;
}

const UserItem = ({ user }: Props) => {
  const {
    setUserInfo,
    socket,
    setConversation,
    setMessages,
    onlineUsers,
    setGetConversationLoading,
  } = useChat();

  const { fetch: postConverSation } = useDataGetter<PostConverSationData>({
    url: "/dashboard/conversations",
    method: "POST",
    immediatelyFetch: false,
  });

  const handleClick = () => {
    setUserInfo(user);
    setGetConversationLoading(true);

    postConverSation?.({ inputBody: { participantId: user.id } })
      .then((data) => {
        if (data.id) {
          socket?.emit("join-conversation", { conversationId: data.id }); // مهم: مستقیم اینجا emit کنیم
          setConversation(data);
          const messages = data?.messages;
          setMessages(messages);
        }
      })
      .finally(() => setGetConversationLoading(false));
  };

  return (
    <div
      onClick={handleClick}
      className="p-2 border-b cursor-pointer hover:bg-gray-100 flex justify-start items-center gap-2"
    >
      {onlineUsers.includes(user.id) && (
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      )}
      <span className="line-clamp-1 overflow-ellipsis w-[70%]">
        {user.firstName || user.email}
      </span>
    </div>
  );
};

export default UserItem;
