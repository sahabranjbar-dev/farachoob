"use client";

import useDataGetter from "@/hooks/useDataGetter";
import { Conversation } from "@/types/common";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useChat } from "../../../../../../stores";
import UserItem from "./UserItem";

export interface IChatList {
  getConversatioLoading?: boolean;
  conversationsData?: Conversation[];
}

const ChatList = ({ getConversatioLoading, conversationsData }: IChatList) => {
  const { data: session } = useSession();
  const setDashboardChatMessage = useChat((s) => s.setDashboardChatMessage);
  const setUserInfo = useChat((s) => s.setUserInfo);
  const setConversatioMessageLoading = useChat(
    (s) => s.setConversatioMessageLoading
  );
  const setConversation = useChat((s) => s.setConversation);
  const socket = useChat((s) => s.socket);

  const userId = session?.user?.id;

  const { fetch: getConversatioMessages } = useDataGetter({
    immediatelyFetch: false,
  });

  if (getConversatioLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!conversationsData?.length) {
    return (
      <p className="text-gray-500 p-6 text-center">
        هیچ کاربری برای شروع گفتگو پیدا نشد.
      </p>
    );
  }

  return (
    <div className="divide-y">
      {conversationsData?.map((conv) => {
        const otherUser = conv?.participants?.find(
          (p) => p.userId !== userId
        )?.user;

        return otherUser ? (
          <UserItem
            key={conv.id}
            user={otherUser}
            unReadMessage={conv._count?.messages}
            messages={conv.messages ?? []}
            getConversatioMessages={() => {
              setConversatioMessageLoading(true);

              setUserInfo(null);

              getConversatioMessages?.({
                inputUrl: "/dashboard/conversations/messages",
                inputParams: { conversationId: conv.id },
              }).then((data) => {
                setDashboardChatMessage(data);

                setUserInfo(otherUser);

                setConversatioMessageLoading(false);

                setConversation(conv);

                socket.emit("join-conversation", { conversationId: conv.id });
              });
            }}
          />
        ) : null;
      })}
    </div>
  );
};

export default ChatList;
