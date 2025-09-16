import { Message } from "@/app/dashboard/[role]/chat/components/ChatMessages";
import { create } from "zustand";

type NewMessage = Message & { loading?: boolean };

export interface ConverSation {
  id?: string;
  title?: any;
  isGroup?: boolean;
  createdAt?: string;
  updatedAt?: string;
  participants?: Participant[];
}

export interface Participant {
  user: User;
}

export interface User {
  id: string;
  email?: string;
  password?: string;
  firstName: string;
  lastName?: string;
  nationalId: any;
  birthDate: any;
  mobile?: string;
  isActive: boolean;
  isVerified: boolean;
  image: any;
  sessionToken?: string;
  roleId: string;
  role?: Role;
  createdAt: string;
}

interface IuseStickyChat {
  showChat: boolean;
  setShowChat: (value: boolean) => void;
  showCTA: boolean;
  setShowCTA: (value: boolean) => void;
  conversationData: ConverSation | null;
  setConversationData: (value: ConverSation | null) => void;
  messages: Message[];
  setMessages: (newMessage: Message[]) => void;
}

export interface Role {
  id: string;
  englishTitle: string;
  farsiTitle: string;
}

export const useStickyChat = create<IuseStickyChat>((set, get) => ({
  showCTA: false,
  showChat: false,
  messages: [],
  conversationData: {},
  //ACTIONS
  setShowChat(value) {
    set({ showChat: value, showCTA: false });
  },
  setShowCTA(value) {
    set({ showCTA: value });
  },
  setConversationData(value) {
    set({ conversationData: value, messages: [] });
  },
  setMessages(newMessage) {
    set({ messages: newMessage });
  },
}));
