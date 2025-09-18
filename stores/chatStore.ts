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
  conversations: [],
  getConversatioMessageLoading: false,

  // ACTIONS
  setConversatioMessageLoading(value) {
    set({ getConversatioMessageLoading: value });
  },
  setDashboardChatMessage(updater) {
    if (typeof updater === "function") {
      set((state) => ({ messages: updater(state.messages) }));
    } else {
      set({ messages: updater });
    }
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
}));
