
import { supabase } from './db';
import { SubscriptionPlan, Subscription, CreateSubscriptionRequest } from '../types';

/**
 * Fetch all available subscription plans
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price');

  if (error) throw error;
  
  // Transform the database results to match our TypeScript types
  return data.map(plan => ({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    interval: plan.interval as any,
    stripeId: plan.stripe_price_id || undefined,
    paypalId: plan.paypal_plan_id || undefined,
    features: plan.features as any,
    maxListings: plan.max_listings,
    maxFeaturedListings: plan.max_featured_listings,
    listingDuration: plan.listing_duration,
    createdAt: plan.created_at,
    updatedAt: plan.updated_at
  }));
}

/**
 * Get subscription for a user
 * @param userId User ID to get subscription for
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, plans:subscription_plans(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No subscription found
      return null;
    }
    throw error;
  }
  
  if (!data) return null;
  
  // Transform the data to match our TypeScript interface
  return {
    id: data.id,
    userId: data.user_id,
    planId: data.plan_id,
    plan: data.plans ? {
      id: data.plans.id,
      name: data.plans.name,
      price: data.plans.price,
      interval: data.plans.interval as any,
      stripeId: data.plans.stripe_price_id || undefined,
      paypalId: data.plans.paypal_plan_id || undefined,
      features: data.plans.features as any,
      maxListings: data.plans.max_listings,
      maxFeaturedListings: data.plans.max_featured_listings,
      listingDuration: data.plans.listing_duration,
      createdAt: data.plans.created_at,
      updatedAt: data.plans.updated_at
    } : undefined,
    status: data.status as any,
    stripeSubscriptionId: data.stripe_subscription_id || undefined,
    paypalSubscriptionId: data.paypal_subscription_id || undefined,
    currentPeriodStart: data.current_period_start,
    currentPeriodEnd: data.current_period_end,
    cancelAtPeriodEnd: data.cancel_at_period_end,
    canceledAt: data.canceled_at || undefined,
    trialStart: data.trial_start || undefined,
    trialEnd: data.trial_end || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Check if a user can add more properties based on their subscription
 * @param userId User ID to check
 */
export async function canUserAddMoreProperties(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription || !subscription.plan) {
    // User has no subscription, use free tier limits
    const { count, error } = await supabase
      .from('properties')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Free tier allows only 1 property
    return (count || 0) < 1;
  }
  
  // If max_listings is null, user can add unlimited properties
  if (subscription.plan.maxListings === null) {
    return true;
  }
  
  // Check how many properties the user has
  const { count, error } = await supabase
    .from('properties')
    .select('id', { count: 'exact' })
    .eq('user_id', userId);
    
  if (error) throw error;
  
  return (count || 0) < (subscription.plan.maxListings || 0);
}

/**
 * Check if a user can feature more properties based on their subscription
 * @param userId User ID to check
 */
export async function canUserFeatureMoreProperties(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription || !subscription.plan) {
    return false; // Free tier doesn't allow featured properties
  }
  
  // Check how many featured properties the user has
  const { count, error } = await supabase
    .from('properties')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_featured', true);
    
  if (error) throw error;
  
  return (count || 0) < subscription.plan.maxFeaturedListings;
}

/**
 * Get subscription details by ID
 * @param subscriptionId Subscription ID
 */
export async function getSubscriptionById(subscriptionId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, plans:subscription_plans(*)')
    .eq('id', subscriptionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  
  if (!data) return null;

  // Transform to match TypeScript interface (similar to getUserSubscription)
  return {
    id: data.id,
    userId: data.user_id,
    planId: data.plan_id,
    plan: data.plans ? {
      id: data.plans.id,
      name: data.plans.name,
      price: data.plans.price,
      interval: data.plans.interval as any,
      stripeId: data.plans.stripe_price_id || undefined,
      paypalId: data.plans.paypal_plan_id || undefined,
      features: data.plans.features as any,
      maxListings: data.plans.max_listings,
      maxFeaturedListings: data.plans.max_featured_listings,
      listingDuration: data.plans.listing_duration,
      createdAt: data.plans.created_at,
      updatedAt: data.plans.updated_at
    } : undefined,
    status: data.status as any,
    stripeSubscriptionId: data.stripe_subscription_id || undefined,
    paypalSubscriptionId: data.paypal_subscription_id || undefined,
    currentPeriodStart: data.current_period_start,
    currentPeriodEnd: data.current_period_end,
    cancelAtPeriodEnd: data.cancel_at_period_end,
    canceledAt: data.canceled_at || undefined,
    trialStart: data.trial_start || undefined,
    trialEnd: data.trial_end || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

// We'll add more methods for creating and managing subscriptions
// once we integrate with Stripe and PayPal
