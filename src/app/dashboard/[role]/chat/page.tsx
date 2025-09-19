"use client";
import { Button } from "@/components/ui/button";
import { useChat } from "../../../../../stores";
import ChatList from "./components/ChatList";
import ChatScreen from "./components/ChatScreen";
import ChatSideBar from "./components/ChatSideBar";
import useDataGetter from "@/hooks/useDataGetter";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { emitSocket } from "@/lib/socket";

const ChatPage = () => {
  const needCustomerChatWithAdmin = useChat(
    (state) => state.needCustomerChatWithAdmin
  );
  const setNeedCustomerChatWithAdmin = useChat(
    (state) => state.setNeedCustomerChatWithAdmin
  );
  const setOnlineUsers = useChat((state) => state.setOnlineUsers);
  const socket = useChat((state) => state.socket);
  const setConversation = useChat((state) => state.setConversation);
  const conversation = useChat((state) => state.conversation);
  const onlineUsers = useChat((state) => state.onlineUsers);
  const session = useSession();
  const userId = session.data?.user.id;
  const { fetch, loading } = useDataGetter({
    url: "/chat/conversation",
    method: "POST",
    immediatelyFetch: false,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
  useEffect(() => {
    if (!socket || !userId) return;
    emitSocket("get-online-users");

    socket.on("user-online", (newUserId: string) => {
      if (!onlineUsers.includes(newUserId)) {
        setOnlineUsers([...onlineUsers, newUserId]);
      }
    });

    socket.on("user-offline", (offlineUserId: string) => {
      setOnlineUsers(onlineUsers.filter((id) => id !== offlineUserId));
    });

    socket.on("online-users-list", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("user-online");
      socket.off("user-offline");
      socket.off("online-users-list");
    };
  }, []);
  return (
    <div className="p-6">
      <section className="border rounded-2xl shadow-lg bg-white h-[80vh] overflow-hidden">
        <div className="flex h-full">
          {needCustomerChatWithAdmin ? (
            <div className="flex flex-col items-center justify-center w-full text-center px-6">
              <div className="bg-gradient-to-tr from-purple-100 to-blue-100 rounded-full p-6 mb-6 shadow-inner">
                <MessageCircle className="w-16 h-16 text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                میتوانید با ادمین چت کنید
              </h2>
              <p className="text-gray-500 mb-6">
                برای شروع گفتگو روی دکمه زیر کلیک کنید
              </p>
              <Button
                disabled={loading}
                onClick={() => {
                  fetch?.({
                    inputParams: {
                      conversationId: conversation?.id,
                    },
                  }).then((data) => {
                    if (data?.conversation?.id) {
                      setNeedCustomerChatWithAdmin(false);
                      setConversation(data.conversation);
                      emitSocket("join-conversation", {
                        conversationId: data?.conversation?.id,
                      });
                    }
                  });
                }}
                className="bg-gradient-to-r from-purple-500 to-orange-500 text-white text-lg px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
              >
                {loading ? "در حال شروع..." : "شروع چت"}
              </Button>
            </div>
          ) : (
            <>
              <ChatSideBar>
                <ChatList />
              </ChatSideBar>
              <ChatScreen />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
