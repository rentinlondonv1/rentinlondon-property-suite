
import { supabase } from './db';
import { 
  Notification, 
  NotificationType, 
  NotificationStatus, 
  NotificationData 
} from '../types';

/**
 * Create a notification in the database
 * @param userId User ID to send the notification to
 * @param type Type of notification
 * @param message Message content
 * @param data Additional data
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  message: string,
  data?: NotificationData
): Promise<Notification> {
  const notificationData = {
    user_id: userId,
    type,
    message,
    data,
    status: 'sent' as NotificationStatus
  };

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single();

  if (error) throw error;

  return transformNotification(notification);
}

/**
 * Get notifications for a user
 * @param userId User ID
 * @param status Filter by status
 * @param page Page number
 * @param limit Items per page
 */
export async function getUserNotifications(
  userId: string,
  status?: NotificationStatus,
  page = 1,
  limit = 20
): Promise<{ notifications: Notification[]; total: number }> {
  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    notifications: transformNotifications(data || []),
    total: count || 0
  };
}

/**
 * Mark a notification as read
 * @param userId User ID
 * @param notificationId Notification ID
 */
export async function markNotificationAsRead(
  userId: string,
  notificationId: string
): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .update({
      status: 'read',
      read_at: new Date().toISOString()
    })
    .eq('id', notificationId)
    .eq('user_id', userId) // Security check
    .select()
    .single();

  if (error) throw error;

  return transformNotification(data);
}

/**
 * Mark all notifications as read for a user
 * @param userId User ID
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({
      status: 'read',
      read_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('status', 'sent');

  if (error) throw error;
}

/**
 * Delete a notification
 * @param userId User ID
 * @param notificationId Notification ID
 */
export async function deleteNotification(
  userId: string,
  notificationId: string
): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', userId); // Security check

  if (error) throw error;
}

/**
 * Helper function to transform database notification object to our TypeScript interface
 */
function transformNotification(notification: any): Notification {
  return {
    id: notification.id,
    userId: notification.user_id,
    type: notification.type,
    message: notification.message,
    data: notification.data || undefined,
    status: notification.status,
    readAt: notification.read_at || undefined,
    createdAt: notification.created_at
  };
}

/**
 * Helper function to transform multiple database notification objects
 */
function transformNotifications(notifications: any[]): Notification[] {
  return notifications.map(transformNotification);
}

// WebSocket notification functionality will be added later
// When we implement the Socket.IO integration
