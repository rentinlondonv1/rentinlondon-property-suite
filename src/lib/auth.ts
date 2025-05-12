
import { supabase } from './db';
import { User, UserRole } from '../types';
import { createNotification } from './notification.service';

/**
 * Register a new user
 * @param email Email
 * @param password Password
 * @param firstName First name
 * @param lastName Last name
 * @param role User role
 */
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole
): Promise<User> {
  // Register user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role
      }
    }
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('User registration failed');

  // Create a welcome notification
  await createNotification(
    authData.user.id,
    'system',
    `Welcome to RentInLondon4U, ${firstName}! Your account has been created successfully.`,
    { welcomeMessage: true }
  );

  return {
    id: authData.user.id,
    email: authData.user.email || '',
    firstName,
    lastName,
    role,
    createdAt: authData.user.created_at || new Date().toISOString()
  };
}

/**
 * Sign in a user
 * @param email Email
 * @param password Password
 */
export async function signInUser(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  if (!data.user) throw new Error('Sign in failed');

  const userData = data.user.user_metadata;

  return {
    id: data.user.id,
    email: data.user.email || '',
    firstName: userData?.first_name || '',
    lastName: userData?.last_name || '',
    role: userData?.role || 'tenant',
    createdAt: data.user.created_at || ''
  };
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const user = userData.user;
  const metadata = user.user_metadata;

  return {
    id: user.id,
    email: user.email || '',
    firstName: metadata?.first_name || '',
    lastName: metadata?.last_name || '',
    avatarUrl: metadata?.avatar_url,
    role: metadata?.role || 'tenant',
    createdAt: user.created_at || ''
  };
}

/**
 * Send password reset email
 * @param email Email address
 */
export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

/**
 * Update user profile
 * @param userId User ID
 * @param data Profile data to update
 */
export async function updateProfile(
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    phoneNumber?: string;
  }
): Promise<User> {
  const { error } = await supabase.auth.updateUser({
    data: {
      first_name: data.firstName,
      last_name: data.lastName,
      avatar_url: data.avatarUrl,
      phone: data.phoneNumber
    }
  });

  if (error) throw error;

  // Get updated user data
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not found');

  const user = userData.user;
  const metadata = user.user_metadata;

  return {
    id: user.id,
    email: user.email || '',
    firstName: metadata?.first_name || '',
    lastName: metadata?.last_name || '',
    avatarUrl: metadata?.avatar_url,
    phoneNumber: metadata?.phone,
    role: metadata?.role || 'tenant',
    createdAt: user.created_at || ''
  };
}

/**
 * Update user email
 * @param email New email
 */
export async function updateEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ email });
  if (error) throw error;
}

/**
 * Update user password
 * @param password New password
 */
export async function updatePassword(password: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}
