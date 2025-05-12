
/**
 * Notification related types for the RentInLondon4U application
 */

export type NotificationType = 'subscription' | 'payment' | 'property' | 'system' | 'message';
export type NotificationStatus = 'sent' | 'delivered' | 'read' | 'archived';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  data?: NotificationData;
  status: NotificationStatus;
  readAt?: string;
  createdAt: string;
}

export interface NotificationData {
  propertyId?: string;
  subscriptionId?: string;
  paymentId?: string;
  [key: string]: any;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: {
    url?: string;
    [key: string]: any;
  };
}
