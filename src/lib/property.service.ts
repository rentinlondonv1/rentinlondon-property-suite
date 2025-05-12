
import { supabase } from './db';
import { Property, PropertySearchFilters } from '@/types';

/**
 * Search for properties based on filters
 */
export const searchProperties = async (filters: PropertySearchFilters) => {
  const {
    query,
    priceMin,
    priceMax,
    bedrooms,
    bathrooms,
    propertyType,
    city,
    sortBy,
    page = 1,
    limit = 9
  } = filters;

  let queryBuilder = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .eq('visibility', 'public');

  // Apply filters
  if (query) {
    queryBuilder = queryBuilder.ilike('title', `%${query}%`);
  }

  if (priceMin) {
    queryBuilder = queryBuilder.gte('price', priceMin);
  }

  if (priceMax) {
    queryBuilder = queryBuilder.lte('price', priceMax);
  }

  if (bedrooms) {
    queryBuilder = queryBuilder.eq('bedrooms', bedrooms);
  }

  if (bathrooms) {
    queryBuilder = queryBuilder.eq('bathrooms', bathrooms);
  }

  if (propertyType) {
    queryBuilder = queryBuilder.eq('property_type', propertyType);
  }

  if (city) {
    queryBuilder = queryBuilder.ilike('city', `%${city}%`);
  }

  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price_asc':
        queryBuilder = queryBuilder.order('price', { ascending: true });
        break;
      case 'price_desc':
        queryBuilder = queryBuilder.order('price', { ascending: false });
        break;
      case 'date_newest':
        queryBuilder = queryBuilder.order('listing_created_at', { ascending: false });
        break;
      case 'date_oldest':
        queryBuilder = queryBuilder.order('listing_created_at', { ascending: true });
        break;
      default:
        queryBuilder = queryBuilder.order('is_featured', { ascending: false }).order('listing_created_at', { ascending: false });
    }
  } else {
    // Default sorting: featured first, then newest
    queryBuilder = queryBuilder.order('is_featured', { ascending: false }).order('listing_created_at', { ascending: false });
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  queryBuilder = queryBuilder.range(from, to);

  const { data, count, error } = await queryBuilder;

  if (error) {
    console.error('Error searching properties:', error);
    throw new Error('Failed to search properties');
  }

  return {
    properties: data as Property[],
    total: count || 0,
  };
};

/**
 * Get property by ID
 */
export const getPropertyById = async (id: string): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    throw new Error('Failed to fetch property details');
  }

  if (!data) {
    throw new Error('Property not found');
  }

  return data as Property;
};

/**
 * Create a new property listing
 */
export const createProperty = async (propertyData: any, userId: string): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .insert([{ ...propertyData, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }

  return data as Property;
};

/**
 * Update a property listing
 */
export const updateProperty = async (id: string, propertyData: any): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating property:', error);
    throw new Error('Failed to update property');
  }

  return data as Property;
};

/**
 * Delete a property listing
 */
export const deleteProperty = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property');
  }
};

/**
 * Mark a property as featured
 */
export const markPropertyAsFeatured = async (id: string, durationDays = 30): Promise<Property> => {
  const featuredUntil = new Date();
  featuredUntil.setDate(featuredUntil.getDate() + durationDays);

  const { data, error } = await supabase
    .from('properties')
    .update({
      is_featured: true,
      featured_until: featuredUntil.toISOString(),
      ad_type: 'featured'
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error marking property as featured:', error);
    throw new Error('Failed to mark property as featured');
  }

  return data as Property;
};

/**
 * Get user properties
 */
export const getUserProperties = async (userId: string): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user properties:', error);
    throw new Error('Failed to fetch your properties');
  }

  return data as Property[];
};
