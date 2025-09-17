import { Message } from "@/types/common";

export interface PostConverSationData {
  id: string;
  title: any;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
  messages: Message[];
}

export interface Participant {
  userId: string;
}
