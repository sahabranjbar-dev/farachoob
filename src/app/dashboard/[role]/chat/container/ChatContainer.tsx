"use client";
import React, { PropsWithChildren, useState } from "react";
import { User } from "../components/UserItem";

interface Props {}

export const ChatContext = React.createContext<{
  userInfo: User | null;
  setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
  conversationId: string | null;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  userInfo: null,
  setUserInfo: () => {},
  conversationId: null,
  setConversationId: () => {},
});

const ChatContainer = ({ children }: PropsWithChildren<Props>) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  return (
    <ChatContext.Provider
      value={{ userInfo, setUserInfo, conversationId, setConversationId }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContainer;
