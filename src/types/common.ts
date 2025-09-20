import { Role } from "./dashboard";

export interface User {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  image?: string | null;
  roleId?: string | null;
  createdAt?: Date | string;
  role?: Role;
  roleFarsiTitle?: string;
  fullName?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  userId: string;
  articleId?: string;
  parentId?: string | null;
  user?: User | null;
  replies?: Comment[];
  likes?: Likes[];
  children?: Comment[];
}

export interface Article {
  id: string;
  title: string;
  content?: string;
  coverImage?: string;
  published?: boolean;
  publishedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  authorId?: string;
}

export interface Likes {
  id: string;
  commentId: string;
  userId: string;
  createdAt: Date | string;
}

export interface Conversation {
  id?: string;
  title?: any;
  isGroup?: boolean;
  createdAt?: string;
  updatedAt?: string;
  participants?: Participant[];
  _count?: Count;
  messages?: Message[];
  isSecure?: boolean;
  role?: Role;
  user?: User;
}

export interface Count {
  messages: number;
}
export interface Participant {
  userId: string;
  user?: User;
}

export interface Message {
  id?: string;
  conversationId?: string;
  senderId?: string;
  content: string;
  metadata?: any;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  delivered?: boolean;
  read?: boolean;
  deleted?: boolean;
  sender?: Sender;
  loading?: boolean;
  participants?: any;
  recipients?: any;
  failed?: boolean;
  tempId?: string;
}

export interface Sender {
  id: string;
  email: string;
  image: any;
}

export interface Notifications {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt?: Date;
  createdAt?: Date;
}

export enum NotificationType {
  INFO,
  SUCCESS,
  WARNING,
  ERROR,
  MESSAGE,
  ORDER,
}
