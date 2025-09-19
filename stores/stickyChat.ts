import { Conversation, Message } from "@/types/common";
import { create } from "zustand";

interface IStickyChatState {
  showChat: boolean;
  showCTA: boolean;
  messages: Message[];
  conversationData: Conversation | null;
  showChatForm: boolean;

  setShowChatForm: (showChatForm: boolean) => void;
  setShowCTA: (value: boolean) => void;
  setShowChat: (value: boolean) => void;
  setConversationData: (value: Conversation | null) => void;
  setMessages: (
    messages: Message[] | ((previousMessages: Message[]) => Message[])
  ) => void;
}

export interface Role {
  id: string;
  englishTitle: string;
  farsiTitle: string;
}

export const useStickyChat = create<IStickyChatState>((set, get) => ({
  showCTA: false,
  showChat: false,
  messages: [],
  conversationData: {},
  showChatForm: false,

  //ACTIONS
  setShowChatForm(showChatForm) {
    set({ showChatForm });
  },
  setShowChat(value) {
    set({ showChat: value, showCTA: false });
  },
  setShowCTA(value) {
    set({ showCTA: value });
  },
  setConversationData(value) {
    set({ conversationData: value, messages: [] });
  },
  setMessages(updater) {
    if (typeof updater === "function") {
      set((state) => ({ messages: updater(state.messages) }));
    } else {
      set({ messages: updater });
    }
  },
}));
