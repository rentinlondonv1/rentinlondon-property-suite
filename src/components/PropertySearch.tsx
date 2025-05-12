
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const PropertySearch = () => {
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search with:', { location, price });
    // Handle search logic here
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-6">
        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search Properties
      </h2>
      
      <form onSubmit={handleSearch} className="space-y-5">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            id="location"
            type="text"
            placeholder="Enter address, neighborhood, or zipcode"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="property-type" className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select 
            id="property-type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rentblue-500 focus:border-rentblue-500"
          >
            <option value="">All property types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
            <option value="room">Room</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price (up to)
          </label>
          <div className="flex justify-between">
            <span className="text-gray-600">£300</span>
            <span className="text-gray-600">£5000+</span>
          </div>
          <input
            type="range"
            min="300"
            max="5000"
            step="100"
            value={price || "1000"}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
          <div className="text-right mt-1">
            <span className="font-medium text-rentblue-600">
              {price ? `£${price}/month` : 'No limit'}
            </span>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-rentblue-500 hover:bg-rentblue-600 text-white py-2 rounded-md transition duration-150 ease-in-out"
        >
          Search Now
        </Button>
      </form>
    </div>
  );
};

export default PropertySearch;
