import { socket } from "@/lib/socket";
import { create } from "zustand";
import { IChatState } from "@/types/chat";

export const useChat = create<IChatState>((set, get) => ({
  socket,
  conversation: null,
  messages: [],
  userInfo: null,
  onlineUsers: [],
  conversations: [],
  getConversatioMessageLoading: false,
  openSidebar: true,
  needCustomerChatWithAdmin: false,
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
  setOnlineUsers(updater) {
    if (typeof updater === "function") {
      set((state) => ({ onlineUsers: updater(state.onlineUsers) }));
    } else {
      set({ onlineUsers: updater });
    }
  },

  setOpenSidebar: (val: boolean) => set({ openSidebar: val }),
  setConversations(conversations) {
    set({ conversations });
  },
  setNeedCustomerChatWithAdmin(needCustomerChatWithAdmin) {
    set({ needCustomerChatWithAdmin });
  },
}));
