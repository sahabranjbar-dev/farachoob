"use client";
import { Conversation, Message, User } from "@/types/common";
import { useChat } from "../../../../../../stores";
import useDataGetter from "@/hooks/useDataGetter";

interface Props {
  user: User;
  unReadMessage?: number;
  messages: Message[];
  conversation: Conversation;
  getConversatioMessages: () => Promise<any> | undefined;
}

const UserItem = ({
  user,
  unReadMessage,
  conversation,
  getConversatioMessages,
}: Props) => {
  const {
    socket,
    setUserInfo,
    setConversatioMessageLoading,
    onlineUsers,
    setConversation,
  } = useChat();

  const handleClick = () => {
    if (!socket) return;

    setUserInfo(user);

    setConversatioMessageLoading(true);

    getConversatioMessages?.()?.then(() => {
      setConversatioMessageLoading(false);
    });

    socket.emit("join-conversation", { conversationId: conversation.id });
    setConversation(conversation);
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
      {!!unReadMessage && (
        <div className="p-2 bg-blue-500 text-white rounded-full h-8 w-8 flex justify-center items-center">
          <span>{unReadMessage}</span>
        </div>
      )}
    </div>
  );
};

export default UserItem;
