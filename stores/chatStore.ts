import { API } from "@/configs/API";
import { IChatState } from "@/types/chat";
import { io } from "socket.io-client";
import { create } from "zustand";

export const useChat = create<IChatState>((set, get) => ({
  socket: io("http://localhost:3000", {
    transports: ["websocket"],
  }),
  conversation: null,
  messages: [],
  userInfo: null,
  onlineUsers: [],
  getConversatioLoading: false,

  //ACTIONS
  setMessages(messages) {
    set({ messages });
  },
  setUserInfo(userInfo) {
    set({ userInfo });
  },
  setConversation(conversation) {
    set({ conversation });
  },
  setOnlineUsers(onlineUsers) {
    set({ onlineUsers });
  },
  postMessage: async (body) => {
    const conversationId = get().conversation?.id;
    const response = await API.post(
      `/dashboard/conversations/${conversationId}/messages`,
      body
    );

    return response.data;
  },
  setGetConversationLoading(loading) {
    set({ getConversatioLoading: loading });
  },
}));
