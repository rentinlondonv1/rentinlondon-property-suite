
/**
 * API related types for the RentInLondon4U application
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth API types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'tenant';
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Subscription API types
export interface CreateSubscriptionRequest {
  planId: string;
  paymentMethod: 'stripe' | 'paypal';
  successUrl: string;
  cancelUrl: string;
}

export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  planId?: string;
  cancelAtPeriodEnd?: boolean;
}

// Property API types
export interface CreatePropertyRequest {
  title: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  currency?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  features?: PropertyFeatures;
  availabilityDate?: string;
  adType?: PropertyAdType;
  visibility?: PropertyVisibility;
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {
  id: string;
}

// Notification API types
export interface UpdateNotificationRequest {
  id: string;
  status?: NotificationStatus;
}

// Push subscription API types
export interface CreatePushSubscriptionRequest {
  endpoint: string;
  p256dh: string;
  auth: string;
}
