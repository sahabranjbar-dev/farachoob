"use client";

import useDataGetter from "@/hooks/useDataGetter";
import { Conversation } from "@/types/common";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useChat } from "../../../../../../stores";
import UserItem from "./UserItem";

const ChatList = () => {
  const { data: session } = useSession();
  const { setConversation, setDashboardChatMessage } = useChat();
  const userId = session?.user?.id;

  const { fetch: getConversatioMessages } = useDataGetter({
    immediatelyFetch: false,
    onSuccess(data) {
      setDashboardChatMessage(data);
    },
  });

  const { data, loading: getConversatioLoading } = useDataGetter<{
    conversations: Conversation[];
  }>({
    url: "/dashboard/conversations",
    onSuccess(data) {
      setConversation(data?.conversations);
    },
  });

  if (getConversatioLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!data?.conversations?.length) {
    return (
      <p className="text-gray-500 p-4">هیچ کاربری برای شروع گفتگو پیدا نشد.</p>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {data?.conversations?.map((conv) => {
        const otherUser = conv?.participants?.find(
          (p) => p.userId !== userId
        )?.user;
        return otherUser ? (
          <UserItem
            key={otherUser.id}
            user={otherUser}
            unReadMessage={conv._count?.messages}
            messages={conv.messages ?? []}
            conversation={conv}
            getConversatioMessages={() =>
              getConversatioMessages?.({
                inputUrl: "/dashboard/conversations/messages",
                inputParams: { conversationId: conv.id },
              })
            }
          />
        ) : null;
      })}
    </div>
  );
};

export default ChatList;
