export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  notificationType: string;
  createdAt: Date;
  isRead: boolean;
  readAt?: Date;
}
