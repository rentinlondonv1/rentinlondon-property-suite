
/**
 * Subscription related types for the RentInLondon4U application
 */

export type SubscriptionInterval = 'month' | 'year' | 'free';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: SubscriptionInterval;
  stripeId?: string;
  paypalId?: string;
  features: SubscriptionFeatures;
  maxListings: number | null;
  maxFeaturedListings: number;
  listingDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFeatures {
  listingsIncluded: number | null;
  featuredIncluded: number;
  listingPriority: 'standard' | 'priority' | 'premium';
  analytics: 'none' | 'basic' | 'advanced';
  marketingTools: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  paypalSubscriptionId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
}
