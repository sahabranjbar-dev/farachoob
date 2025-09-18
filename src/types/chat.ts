import { Socket } from "socket.io-client";
import { Conversation, Message, User } from "./common";

export interface IChatState {
  socket: Socket;
  userInfo: User | null;
  conversation: Conversation | null;
  messages: Message[];
  onlineUsers: string[];
  conversations: Conversation[];
  getConversatioMessageLoading: boolean;
  openSidebar: boolean;

  setOpenSidebar: (openSidebar: boolean) => void;
  setConversatioMessageLoading: (value: boolean) => void;
  setOnlineUsers: (onlineUsers: string[]) => void;
  setDashboardChatMessage: (
    messages: Message[] | ((previousMessages: Message[]) => Message[])
  ) => void;
  setConversation: (conversation: Conversation | null) => void;
  setUserInfo: (userInfo: User | null) => void;
  setConversations: (conversations: Conversation[]) => void;
}
