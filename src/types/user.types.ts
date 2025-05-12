
/**
 * User related types for the RentInLondon4U application
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: string;
}

export type UserRole = 'owner' | 'tenant' | 'admin';

export interface UserProfile extends User {
  bio?: string;
  company?: string;
  website?: string;
  location?: string;
  notificationPreferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  subscriptionAlerts: boolean;
  propertyAlerts: boolean;
  marketingAlerts: boolean;
}

export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: string;
}
