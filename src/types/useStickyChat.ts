import { Conversation, Message } from "./common";

export interface IStickyChatStates {
  openStickyChat: boolean;
  showCTA: boolean;
  messages: Message[];
  conversationData: Conversation | null;

  setShowCTA: (value: boolean) => void;
  setConversationData: (value: Conversation | null) => void;
  SetOpenStickyChat: (value: boolean) => void;
  setMessages: (
    messages: Message[] | ((previousMessages: Message[]) => Message[])
  ) => void;
}
