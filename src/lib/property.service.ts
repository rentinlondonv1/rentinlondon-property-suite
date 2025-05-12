
import { supabase } from './db';
import { Property, PropertyStatus, PropertySearchFilters, CreatePropertyRequest, UpdatePropertyRequest } from '../types';
import { getUserSubscription } from './subscription.service';

/**
 * Get featured properties for the homepage
 */
export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return transformProperties(data || []);
}

/**
 * Get property by ID
 * @param id Property ID
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  if (!data) return null;

  return transformProperty(data);
}

/**
 * Get properties by user ID
 * @param userId User ID
 * @param status Filter by property status
 * @param page Page number
 * @param limit Number of items per page
 */
export async function getUserProperties(
  userId: string, 
  status?: PropertyStatus,
  page = 1,
  limit = 10
): Promise<{ properties: Property[]; total: number }> {
  let query = supabase
    .from('properties')
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
    properties: transformProperties(data || []),
    total: count || 0
  };
}

/**
 * Search properties with filters
 * @param filters Search filters
 */
export async function searchProperties(
  filters: PropertySearchFilters
): Promise<{ properties: Property[]; total: number }> {
  const {
    query,
    priceMin,
    priceMax,
    bedrooms,
    bathrooms,
    propertyType,
    areaSqmMin,
    areaSqmMax,
    features,
    city,
    sortBy,
    page = 1,
    limit = 10
  } = filters;

  let dbQuery = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .eq('visibility', 'public')
    .range((page - 1) * limit, page * limit - 1);

  // Apply filters
  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`);
  }

  if (priceMin !== undefined) {
    dbQuery = dbQuery.gte('price', priceMin);
  }

  if (priceMax !== undefined) {
    dbQuery = dbQuery.lte('price', priceMax);
  }

  if (bedrooms !== undefined) {
    dbQuery = dbQuery.eq('bedrooms', bedrooms);
  }

  if (bathrooms !== undefined) {
    dbQuery = dbQuery.eq('bathrooms', bathrooms);
  }

  if (propertyType) {
    dbQuery = dbQuery.eq('property_type', propertyType);
  }

  if (areaSqmMin !== undefined) {
    dbQuery = dbQuery.gte('area_sqm', areaSqmMin);
  }

  if (areaSqmMax !== undefined) {
    dbQuery = dbQuery.lte('area_sqm', areaSqmMax);
  }

  if (city) {
    dbQuery = dbQuery.eq('city', city);
  }

  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price_asc':
        dbQuery = dbQuery.order('price', { ascending: true });
        break;
      case 'price_desc':
        dbQuery = dbQuery.order('price', { ascending: false });
        break;
      case 'date_newest':
        dbQuery = dbQuery.order('created_at', { ascending: false });
        break;
      case 'date_oldest':
        dbQuery = dbQuery.order('created_at', { ascending: true });
        break;
    }
  } else {
    // Default sort: featured properties first, then newest
    dbQuery = dbQuery.order('is_featured', { ascending: false })
                     .order('created_at', { ascending: false });
  }

  // Features filter (more complex as they're stored in a JSONB column)
  // This would need to be enhanced based on actual Supabase capabilities
  
  const { data, error, count } = await dbQuery;

  if (error) throw error;

  // Additional filter for features (post-processing on client side)
  let filteredData = data || [];
  
  if (features && features.length > 0) {
    filteredData = filteredData.filter(property => {
      if (!property.features) return false;
      
      return features.every(feature => 
        property.features && (property.features as any)[feature] === true
      );
    });
  }

  return {
    properties: transformProperties(filteredData),
    total: count || 0
  };
}

/**
 * Create a new property listing
 * @param userId User ID creating the property
 * @param property Property data
 */
export async function createProperty(
  userId: string, 
  property: CreatePropertyRequest
): Promise<Property> {
  // Get user's subscription to determine property settings
  const subscription = await getUserSubscription(userId);
  const listingDuration = subscription?.plan?.listingDuration || 30; // Default to 30 days for free tier
  
  const listingExpiresAt = new Date();
  listingExpiresAt.setDate(listingExpiresAt.getDate() + listingDuration);

  const propertyData = {
    user_id: userId,
    title: property.title,
    description: property.description || null,
    address: property.address || null,
    city: property.city || 'London',
    country: property.country || 'United Kingdom',
    latitude: property.latitude || null,
    longitude: property.longitude || null,
    price: property.price || null,
    currency: property.currency || 'GBP',
    property_type: property.propertyType || null,
    bedrooms: property.bedrooms || null,
    bathrooms: property.bathrooms || null,
    area_sqm: property.areaSqm || null,
    features: property.features || null,
    images: null, // Images will be added in a separate step
    status: 'draft' as PropertyStatus,
    availability_date: property.availabilityDate || null,
    is_featured: false, // Default to not featured
    ad_type: property.adType || 'standard',
    listing_expires_at: listingExpiresAt.toISOString(),
    visibility: property.visibility || 'public',
  };

  const { data, error } = await supabase
    .from('properties')
    .insert(propertyData)
    .select()
    .single();

  if (error) throw error;

  return transformProperty(data);
}

/**
 * Update a property listing
 * @param userId User ID updating the property (for authorization)
 * @param property Property data to update
 */
export async function updateProperty(
  userId: string,
  property: UpdatePropertyRequest
): Promise<Property> {
  // First, verify ownership
  const { data: existingProperty, error: fetchError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', property.id)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;
  if (!existingProperty) throw new Error('Property not found or not authorized');

  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString()
  };

  // Only update fields that are provided
  if (property.title !== undefined) updateData.title = property.title;
  if (property.description !== undefined) updateData.description = property.description;
  if (property.address !== undefined) updateData.address = property.address;
  if (property.city !== undefined) updateData.city = property.city;
  if (property.country !== undefined) updateData.country = property.country;
  if (property.latitude !== undefined) updateData.latitude = property.latitude;
  if (property.longitude !== undefined) updateData.longitude = property.longitude;
  if (property.price !== undefined) updateData.price = property.price;
  if (property.currency !== undefined) updateData.currency = property.currency;
  if (property.propertyType !== undefined) updateData.property_type = property.propertyType;
  if (property.bedrooms !== undefined) updateData.bedrooms = property.bedrooms;
  if (property.bathrooms !== undefined) updateData.bathrooms = property.bathrooms;
  if (property.areaSqm !== undefined) updateData.area_sqm = property.areaSqm;
  if (property.features !== undefined) updateData.features = property.features;
  if (property.availabilityDate !== undefined) updateData.availability_date = property.availabilityDate;
  if (property.adType !== undefined) updateData.ad_type = property.adType;
  if (property.visibility !== undefined) updateData.visibility = property.visibility;

  const { data, error } = await supabase
    .from('properties')
    .update(updateData)
    .eq('id', property.id)
    .select()
    .single();

  if (error) throw error;

  return transformProperty(data);
}

/**
 * Delete a property listing
 * @param userId User ID deleting the property (for authorization)
 * @param propertyId Property ID to delete
 */
export async function deleteProperty(userId: string, propertyId: string): Promise<void> {
  // First, verify ownership
  const { data: existingProperty, error: fetchError } = await supabase
    .from('properties')
    .select('id')
    .eq('id', propertyId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;
  if (!existingProperty) throw new Error('Property not found or not authorized');

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId);

  if (error) throw error;
}

/**
 * Publish a property draft
 * @param userId User ID publishing the property (for authorization)
 * @param propertyId Property ID to publish
 */
export async function publishProperty(userId: string, propertyId: string): Promise<Property> {
  // First, verify ownership
  const { data: existingProperty, error: fetchError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;
  if (!existingProperty) throw new Error('Property not found or not authorized');
  
  // Check if user can publish based on subscription
  const subscription = await getUserSubscription(userId);
  const listingDuration = subscription?.plan?.listingDuration || 30;
  
  const listingExpiresAt = new Date();
  listingExpiresAt.setDate(listingExpiresAt.getDate() + listingDuration);

  const { data, error } = await supabase
    .from('properties')
    .update({
      status: 'published',
      listing_created_at: new Date().toISOString(),
      listing_expires_at: listingExpiresAt.toISOString()
    })
    .eq('id', propertyId)
    .select()
    .single();

  if (error) throw error;

  return transformProperty(data);
}

/**
 * Increment property view count
 * @param propertyId Property ID
 */
export async function incrementPropertyView(propertyId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_property_view', {
    property_id: propertyId
  });

  if (error) throw error;
}

/**
 * Increment property contact click count
 * @param propertyId Property ID
 */
export async function incrementContactClick(propertyId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_contact_click', {
    property_id: propertyId
  });

  if (error) throw error;
}

/**
 * Feature a property
 * @param userId User ID featuring the property (for authorization)
 * @param propertyId Property ID to feature
 * @param durationDays Duration in days to feature
 */
export async function featureProperty(
  userId: string, 
  propertyId: string,
  durationDays = 30
): Promise<Property> {
  // First, verify ownership
  const { data: existingProperty, error: fetchError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;
  if (!existingProperty) throw new Error('Property not found or not authorized');
  
  // Check if user can feature more properties
  const canFeature = await canUserFeatureMoreProperties(userId);
  if (!canFeature) {
    throw new Error('Subscription plan limit reached for featured properties');
  }
  
  const featuredUntil = new Date();
  featuredUntil.setDate(featuredUntil.getDate() + durationDays);

  const { data, error } = await supabase
    .from('properties')
    .update({
      is_featured: true,
      featured_until: featuredUntil.toISOString(),
      ad_type: 'featured'
    })
    .eq('id', propertyId)
    .select()
    .single();

  if (error) throw error;

  return transformProperty(data);
}

/**
 * Helper function to check if the user can feature more properties
 */
async function canUserFeatureMoreProperties(userId: string): Promise<boolean> {
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
 * Helper function to transform database property object to our TypeScript interface
 */
function transformProperty(property: any): Property {
  return {
    id: property.id,
    userId: property.user_id,
    title: property.title,
    description: property.description || undefined,
    address: property.address || undefined,
    city: property.city,
    country: property.country,
    latitude: property.latitude || undefined,
    longitude: property.longitude || undefined,
    price: property.price || undefined,
    currency: property.currency,
    propertyType: property.property_type || undefined,
    bedrooms: property.bedrooms || undefined,
    bathrooms: property.bathrooms || undefined,
    areaSqm: property.area_sqm || undefined,
    features: property.features || undefined,
    images: property.images || [],
    virtualTourUrl: property.virtual_tour_url || undefined,
    status: property.status,
    availabilityDate: property.availability_date || undefined,
    isFeatured: property.is_featured,
    featuredUntil: property.featured_until || undefined,
    adType: property.ad_type,
    viewsCount: property.views_count,
    contactClicks: property.contact_clicks,
    listingCreatedAt: property.listing_created_at,
    listingExpiresAt: property.listing_expires_at || undefined,
    promotionStatus: property.promotion_status,
    visibility: property.visibility,
    createdAt: property.created_at,
    updatedAt: property.updated_at
  };
}

/**
 * Helper function to transform multiple database property objects
 */
function transformProperties(properties: any[]): Property[] {
  return properties.map(transformProperty);
}
