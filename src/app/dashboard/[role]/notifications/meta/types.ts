import { NotificationType } from "@/types/common";

export interface INotificationItem {
  id: string;
  isRead: boolean;
  iconType?: NotificationType;
  message: string;
  createdAt?: Date;
  title: string;
}
