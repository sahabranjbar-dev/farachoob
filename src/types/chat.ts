import { Socket } from "socket.io-client";
import { Conversation, Message, User } from "./common";

export interface IChatState {
  socket: Socket;
  userInfo: User | null;
  conversation: Conversation | null;
  messages: Message[];
  onlineUsers: string[];
  getConversatioLoading: boolean;

  setOnlineUsers: (onlineUsers: string[]) => void;
  setMessages: (messages: Message[]) => void;
  setConversation: (conversation: Conversation) => void;
  setUserInfo: (userInfo: User | null) => void;
  postMessage: (body: Message) => Promise<Message>;
  setGetConversationLoading: (loading: boolean) => void;
}
