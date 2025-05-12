
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
