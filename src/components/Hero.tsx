
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import PropertySearch from './PropertySearch';
import { Link } from 'react-router-dom';
import { PropertySearchFilters } from '@/types';

const Hero = () => {
  const [filters, setFilters] = useState<PropertySearchFilters>({
    city: '',
    priceMax: 1000
  });
  
  const handleFilterChange = (newFilters: Partial<PropertySearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  return <div className="relative bg-gray-900 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      backgroundBlendMode: 'multiply'
    }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-900/50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
              Find Your Perfect <br />
              <span className="text-rentblue-400">London</span> Home
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-8">
              The premium platform for renting apartments,
              rooms, and shared houses in London,
              tailored for young professionals and families.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button className="bg-rentblue-500 hover:bg-rentblue-600 text-white px-8 py-3">
                <Link to="/properties">
                  Start Your Search
                </Link>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                <Link to="/auth/login">
                  Login / Register
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right side search component */}
          <div className="lg:w-1/2 lg:pl-8">
            <PropertySearch filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,170.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>;
};

export default Hero;
