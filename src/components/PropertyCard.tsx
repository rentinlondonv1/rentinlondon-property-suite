
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  featured?: boolean;
  availability?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  price,
  imageUrl,
  propertyType,
  bedrooms,
  bathrooms,
  featured = false,
  availability = "Available Now"
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {featured && (
          <span className="absolute top-2 left-2 bg-rentblue-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            Featured
          </span>
        )}
        <button className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all z-10">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={imageUrl || "https://via.placeholder.com/300x200?text=Property+Image"} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-rentblue-600">{title}</h3>
          <p className="text-rentblue-600 font-bold">£{price}/mo</p>
        </div>
        
        <div className="flex items-center mb-3 text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {propertyType}
          </span>
          {bedrooms > 0 && (
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
            </span>
          )}
          {bathrooms > 0 && (
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {bathrooms} {bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm ${availability.includes('Available') ? 'text-green-600' : 'text-yellow-600'}`}>
            {availability}
          </span>
          <Button className="bg-rentblue-500 hover:bg-rentblue-600 text-white text-sm py-1">
            <Link to={`/properties/${id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
