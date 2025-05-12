
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { searchProperties } from '@/lib/property.service';
import { PropertySearchFilters } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import PropertySearch from '@/components/PropertySearch';
import { toast } from '@/hooks/use-toast';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<PropertySearchFilters>({
    page: 1,
    limit: 9,
  });

  // Extract search parameters from URL
  useEffect(() => {
    const query = searchParams.get('query') || undefined;
    const priceMin = searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined;
    const priceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined;
    const bedrooms = searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined;
    const bathrooms = searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined;
    const propertyType = searchParams.get('propertyType') || undefined;
    const city = searchParams.get('city') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

    setFilters({
      query,
      priceMin,
      priceMax,
      bedrooms,
      bathrooms,
      propertyType: propertyType as any,
      city,
      sortBy: sortBy as any,
      page,
      limit: 9,
    });
  }, [searchParams]);

  // Fetch properties based on filters
  const { data, isLoading, isError } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => searchProperties(filters),
    meta: {
      onError: (error: any) => {
        toast({
          title: "Error loading properties",
          description: error.message || "Failed to load properties. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const handleFilterChange = (newFilters: Partial<PropertySearchFilters>) => {
    // Update URL with new filters
    const updatedParams = new URLSearchParams(searchParams);
    
    // Reset page when filters change
    if (Object.keys(newFilters).some(key => key !== 'page')) {
      updatedParams.set('page', '1');
    }
    
    // Update or delete parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, String(value));
      }
    });
    
    setSearchParams(updatedParams);
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange({ page: newPage });
  };

  const totalPages = data ? Math.ceil(data.total / filters.limit!) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Perfect Home in London</h1>
          
          {/* Search and filter component */}
          <PropertySearch 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading properties...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading properties. Please try again.</p>
          </div>
        ) : data && data.properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.properties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  {...property} 
                  location={`${property.city}, ${property.country}`}
                  imageUrl={property.images && property.images.length > 0 
                    ? property.images[0].url 
                    : '/placeholder.svg'
                  }
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handlePageChange(filters.page! - 1)}
                    disabled={filters.page === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === filters.page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handlePageChange(filters.page! + 1)}
                    disabled={filters.page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p>No properties found matching your search criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchParams({})}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertiesPage;
