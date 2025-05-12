
import { supabase } from './db';

/**
 * Increment property view count using RPC function
 * @param propertyId Property ID
 */
export async function incrementPropertyView(propertyId: string): Promise<void> {
  // First, let's check if the function exists in the database
  try {
    const { error } = await supabase.rpc('increment_property_view', {
      property_id: propertyId
    });

    // If the function doesn't exist yet, we'll implement a fallback
    if (error) {
      // Fallback to direct update if RPC not available
      await supabase
        .from('properties')
        .update({ views_count: supabase.rpc('increment', { count: 'views_count' }) })
        .eq('id', propertyId);
    }
  } catch (error) {
    console.error('Error incrementing property view:', error);
    // Fallback with manual increment as a last resort
    const { data } = await supabase
      .from('properties')
      .select('views_count')
      .eq('id', propertyId)
      .single();
    
    if (data) {
      await supabase
        .from('properties')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', propertyId);
    }
  }
}

/**
 * Increment property contact click count using RPC function
 * @param propertyId Property ID
 */
export async function incrementContactClick(propertyId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_contact_click', {
      property_id: propertyId
    });

    // Fallback if function doesn't exist
    if (error) {
      await supabase
        .from('properties')
        .update({ contact_clicks: supabase.rpc('increment', { count: 'contact_clicks' }) })
        .eq('id', propertyId);
    }
  } catch (error) {
    console.error('Error incrementing contact click:', error);
    // Fallback with manual increment
    const { data } = await supabase
      .from('properties')
      .select('contact_clicks')
      .eq('id', propertyId)
      .single();
    
    if (data) {
      await supabase
        .from('properties')
        .update({ contact_clicks: (data.contact_clicks || 0) + 1 })
        .eq('id', propertyId);
    }
  }
}

/**
 * Check and update expired property listings
 * This would typically be run by a cron job or similar scheduled process
 */
export async function updateExpiredListings(): Promise<void> {
  const now = new Date().toISOString();
  
  // Update expired listings
  await supabase
    .from('properties')
    .update({ status: 'expired' })
    .eq('status', 'published')
    .lt('listing_expires_at', now);

  // Update expired featured status
  await supabase
    .from('properties')
    .update({ 
      is_featured: false,
      ad_type: 'standard'
    })
    .eq('is_featured', true)
    .lt('featured_until', now);
}
