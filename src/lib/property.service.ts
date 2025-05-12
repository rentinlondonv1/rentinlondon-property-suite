
import { supabase } from './db';
import { Property, PropertyDB, PropertySearchFilters, PropertyImage, PropertyFeatures, PropertyType, PropertyStatus, PropertyAdType, PropertyPromotionStatus, PropertyVisibility } from '@/types';
import { Json } from '@/integrations/supabase/types';

/**
 * Safely convert JSON features to PropertyFeatures
 */
const convertFeatures = (featuresJson: Json | null): PropertyFeatures | undefined => {
  if (!featuresJson) return undefined;
  
  try {
    return featuresJson as PropertyFeatures;
  } catch (error) {
    console.error('Error parsing features:', error);
    return undefined;
  }
};

/**
 * Safely convert JSON images to PropertyImage array
 */
const convertImages = (imagesJson: Json | null): PropertyImage[] | undefined => {
  if (!imagesJson) return undefined;
  
  try {
    // Make sure we're dealing with an array
    if (Array.isArray(imagesJson)) {
      return imagesJson.map(img => {
        // Validate each image object has the required properties
        if (typeof img === 'object' && img !== null && 'url' in img && 'publicId' in img) {
          return {
            url: String(img.url),
            publicId: String(img.publicId),
            caption: 'caption' in img ? String(img.caption) : undefined,
            isPrimary: 'isPrimary' in img ? Boolean(img.isPrimary) : false
          };
        }
        // If invalid image data, return a placeholder
        console.warn('Invalid image data found:', img);
        return {
          url: '/placeholder.svg',
          publicId: 'placeholder'
        };
      });
    }
    console.warn('Images data is not an array:', imagesJson);
    return [];
  } catch (error) {
    console.error('Error parsing images:', error);
    return [];
  }
};

/**
 * Convert database property format to frontend format
 */
const convertToProperty = (dbProperty: PropertyDB): Property => {
  return {
    id: dbProperty.id,
    userId: dbProperty.user_id,
    title: dbProperty.title,
    description: dbProperty.description || undefined,
    address: dbProperty.address || undefined,
    city: dbProperty.city || '',
    country: dbProperty.country || '',
    latitude: dbProperty.latitude || undefined,
    longitude: dbProperty.longitude || undefined,
    price: dbProperty.price || undefined,
    currency: dbProperty.currency || 'GBP',
    propertyType: (dbProperty.property_type as PropertyType) || undefined,
    bedrooms: dbProperty.bedrooms || undefined,
    bathrooms: dbProperty.bathrooms || undefined,
    areaSqm: dbProperty.area_sqm || undefined,
    features: convertFeatures(dbProperty.features),
    images: convertImages(dbProperty.images),
    virtualTourUrl: dbProperty.virtual_tour_url || undefined,
    status: (dbProperty.status as PropertyStatus) || 'draft',
    availabilityDate: dbProperty.availability_date || undefined,
    isFeatured: dbProperty.is_featured || false,
    featuredUntil: dbProperty.featured_until || undefined,
    adType: (dbProperty.ad_type as PropertyAdType) || 'standard',
    viewsCount: dbProperty.views_count || 0,
    contactClicks: dbProperty.contact_clicks || 0,
    listingCreatedAt: dbProperty.listing_created_at || new Date().toISOString(),
    listingExpiresAt: dbProperty.listing_expires_at || undefined,
    promotionStatus: (dbProperty.promotion_status as PropertyPromotionStatus) || 'inactive',
    visibility: (dbProperty.visibility as PropertyVisibility) || 'public',
    createdAt: dbProperty.created_at || new Date().toISOString(),
    updatedAt: dbProperty.updated_at || new Date().toISOString()
  };
};

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
    properties: data ? data.map(item => convertToProperty(item as PropertyDB)) : [],
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

  return convertToProperty(data as PropertyDB);
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

  return convertToProperty(data as PropertyDB);
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

  return convertToProperty(data as PropertyDB);
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

  return convertToProperty(data as PropertyDB);
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

  return data ? data.map(item => convertToProperty(item as PropertyDB)) : [];
};
