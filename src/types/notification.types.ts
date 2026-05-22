import { Timestamp } from 'firebase/firestore';

export type NotificationType = 'rain' | 'pest' | 'price' | 'sow' | 'spray' | 'scheme' | 'tip';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  priority: NotificationPriority;
  isRead: boolean;
  deepLink: string;
  createdAt: Timestamp;
  readAt: Timestamp | null;
  icon: string;
}

export interface NotificationPreferences {
  push: boolean;
  sms: boolean;
  email: boolean;
  types: Record<NotificationType, boolean>;
}
