
// Utility functions for database operations
import { supabase } from './db';

/**
 * Increment the views count for a property
 */
export const incrementPropertyView = async (propertyId: string): Promise<void> => {
  try {
    // First get the current count
    const { data: property } = await supabase
      .from('properties')
      .select('views_count')
      .eq('id', propertyId)
      .single();
    
    if (!property) return;
    
    const currentCount = property.views_count || 0;
    
    // Then update with the incremented value
    await supabase
      .from('properties')
      .update({ views_count: currentCount + 1 })
      .eq('id', propertyId);
  } catch (error) {
    console.error('Error incrementing property view count:', error);
  }
};

/**
 * Increment the contact click count for a property
 */
export const incrementContactClick = async (propertyId: string): Promise<void> => {
  try {
    // First get the current count
    const { data: property } = await supabase
      .from('properties')
      .select('contact_clicks')
      .eq('id', propertyId)
      .single();
    
    if (!property) return;
    
    const currentCount = property.contact_clicks || 0;
    
    // Then update with the incremented value
    await supabase
      .from('properties')
      .update({ contact_clicks: currentCount + 1 })
      .eq('id', propertyId);
  } catch (error) {
    console.error('Error incrementing property contact clicks:', error);
  }
};
