"use client";
import React, { PropsWithChildren, useState } from "react";
import { User } from "../components/UserItem";
import { Message } from "../components/ChatMessages";

interface Props {}

type MessageWithLoading = Message & { loading?: boolean };

export const ChatContext = React.createContext<{
  userInfo: User | null;
  setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
  conversationId: string | null;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  messages: MessageWithLoading[];
  setMessages: React.Dispatch<React.SetStateAction<MessageWithLoading[]>>;
}>({
  userInfo: null,
  setUserInfo: () => {},
  conversationId: null,
  setConversationId: () => {},
  loading: false,
  setLoading: () => {},
  messages: [],
  setMessages: () => {},
});

const ChatContainer = ({ children }: PropsWithChildren<Props>) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageWithLoading[]>([]);

  return (
    <ChatContext.Provider
      value={{
        userInfo,
        setUserInfo,
        conversationId,
        setConversationId,
        loading,
        setLoading,
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContainer;
