export type NotificationsTypes =
  | "INFO"
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "MESSAGE"
  | "ORDER";

export interface Notifications {
  id?: string;
  title: string;
  message: string;
  type?: NotificationsTypes;
  isRead?: boolean;
  readAt?: Date | string;
  createdAt?: Date | string;
}

export interface Notification {
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  id: string;
  metadata: any;
  updatedAt: string;
  delivered: boolean;
  read: boolean;
  deleted: boolean;
  sender: Sender;
}

export interface Sender {
  id: string;
  email: string;
  image: any;
}
