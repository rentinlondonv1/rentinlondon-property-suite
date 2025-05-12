
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Sample property data
const featuredProperties = [
  {
    id: "1",
    title: "Modern Studio in Soho",
    location: "Soho, London W1",
    price: 1250,
    imageUrl: "/lovable-uploads/98aa7abd-2bea-4d5b-b84f-acb694487675.png",
    propertyType: "Studio",
    bedrooms: 0,
    bathrooms: 1,
    featured: true
  },
  {
    id: "2",
    title: "Spacious 2 Bed Apartment",
    location: "Camden, London NW1",
    price: 1800,
    imageUrl: "/lovable-uploads/1a0cf86e-01c8-4bc2-872a-46c07090ebf0.png",
    propertyType: "Apartment",
    bedrooms: 2,
    bathrooms: 1
  },
  {
    id: "3",
    title: "Cozy Room in Shared House",
    location: "Brixton, London SW9",
    price: 950,
    imageUrl: "/lovable-uploads/d9e70650-7287-4d5a-8210-021e7e85927e.png",
    propertyType: "Room",
    bedrooms: 1,
    bathrooms: 1,
    availability: "From June 1"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Properties Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
                <p className="text-gray-600 mt-2">Discover our hand-picked selection of the finest rental properties across London</p>
              </div>
              <Button variant="outline" className="hidden sm:block">
                <Link to="/properties">View All Properties</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
            
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline">
                <Link to="/properties">View All Properties</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Testimonials */}
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
