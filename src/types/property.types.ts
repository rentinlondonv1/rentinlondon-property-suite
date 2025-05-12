
/**
 * Property related types for the RentInLondon4U application
 */

export type PropertyStatus = 'draft' | 'published' | 'rented' | 'archived' | 'expired';
export type PropertyAdType = 'standard' | 'featured';
export type PropertyVisibility = 'public' | 'private' | 'unlisted';
export type PropertyPromotionStatus = 'active' | 'inactive' | 'expired';
export type PropertyType = 'apartment' | 'house' | 'studio' | 'room' | 'commercial' | 'other';

export interface PropertyImage {
  url: string;
  publicId: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface PropertyFeatures {
  airConditioning?: boolean;
  balcony?: boolean;
  furnished?: boolean;
  garden?: boolean;
  parking?: boolean;
  petsAllowed?: boolean;
  wheelchairAccessible?: boolean;
  elevator?: boolean;
  gym?: boolean;
  securitySystem?: boolean;
  swimmingPool?: boolean;
  wifi?: boolean;
  [key: string]: boolean | undefined; // Allow for custom features
}

// This interface maps directly to the database columns with snake_case
export interface PropertyDB {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  address?: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  currency: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  features?: PropertyFeatures;
  images?: PropertyImage[];
  virtual_tour_url?: string;
  status: PropertyStatus;
  availability_date?: string;
  is_featured: boolean;
  featured_until?: string;
  ad_type: PropertyAdType;
  views_count: number;
  contact_clicks: number;
  listing_created_at: string;
  listing_expires_at?: string;
  promotion_status: PropertyPromotionStatus;
  visibility: PropertyVisibility;
  created_at: string;
  updated_at: string;
}

// This interface uses camelCase for frontend code
export interface Property {
  id: string;
  userId: string;
  title: string;
  description?: string;
  address?: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  currency: string;
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  features?: PropertyFeatures;
  images?: PropertyImage[];
  virtualTourUrl?: string;
  status: PropertyStatus;
  availabilityDate?: string;
  isFeatured: boolean;
  featuredUntil?: string;
  adType: PropertyAdType;
  viewsCount: number;
  contactClicks: number;
  listingCreatedAt: string;
  listingExpiresAt?: string;
  promotionStatus: PropertyPromotionStatus;
  visibility: PropertyVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface PropertySearchFilters {
  query?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: PropertyType;
  areaSqmMin?: number;
  areaSqmMax?: number;
  features?: string[];
  city?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'date_newest' | 'date_oldest';
  page?: number;
  limit?: number;
}

export interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  location: string;
  imageUrl: string;
  isFeatured?: boolean;
}

