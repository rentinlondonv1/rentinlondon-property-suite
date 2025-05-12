
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPropertyById } from '@/lib/property.service';
import { incrementContactClick, incrementPropertyView } from '@/lib/db.utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bed, Bath, Home, MapPin, Calendar, Phone, Share2, Heart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isSaved, setIsSaved] = useState(false);
  
  // Fetch property details
  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => id ? getPropertyById(id) : null,
    onSuccess: () => {
      // Increment view count
      if (id) incrementPropertyView(id).catch(console.error);
    },
    onError: (error: any) => {
      toast({
        title: "Error loading property",
        description: error.message || "Failed to load property details. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleContactClick = () => {
    if (id) {
      incrementContactClick(id).catch(console.error);
    }
    
    // Here you could open a contact modal or trigger other action
    toast({
      title: "Contact Request",
      description: "The property owner has been notified of your interest.",
    });
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    
    toast({
      title: isSaved ? "Property Removed" : "Property Saved",
      description: isSaved 
        ? "This property has been removed from your saved list." 
        : "This property has been added to your saved list.",
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request';
    return `£${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p>Loading property details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500">Property not found or error loading details.</p>
            <Button asChild className="mt-4">
              <Link to="/properties">Back to Properties</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ url: '/placeholder.svg', publicId: 'placeholder' }];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/properties" className="text-blue-600 hover:underline">
            ← Back to Properties
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Images and details */}
          <div className="lg:col-span-2">
            {/* Image carousel */}
            <div className="mb-8">
              <Carousel>
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="overflow-hidden rounded-lg h-[400px]">
                        <img
                          src={image.url}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            
            {/* Title and badges */}
            <div className="mb-6">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="flex gap-2">
                  {property.isFeatured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="outline">{property.propertyType}</Badge>
                </div>
              </div>
              
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <p>{property.address || `${property.city}, ${property.country}`}</p>
              </div>
              
              <p className="text-2xl font-bold mt-4 text-blue-600">
                {formatPrice(property.price)} {property.price ? '/ month' : ''}
              </p>
            </div>
            
            {/* Key features */}
            <div className="flex flex-wrap gap-6 mb-6">
              {property.bedrooms !== undefined && (
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                </div>
              )}
              {property.areaSqm !== undefined && (
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{property.areaSqm} m²</span>
                </div>
              )}
              {property.availabilityDate && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Available from {new Date(property.availabilityDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <Separator className="my-6" />
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="whitespace-pre-line">{property.description || 'No description provided.'}</p>
            </div>
            
            {/* Features */}
            {property.features && Object.keys(property.features).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(property.features).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column: Contact card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Contact the Property Owner</h3>
                <Button 
                  onClick={handleContactClick}
                  className="w-full mb-4"
                  size="lg"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Request Contact
                </Button>
                
                <div className="flex gap-2 mb-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleToggleSave}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link Copied",
                        description: "Property link has been copied to clipboard."
                      });
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Property ID: {property.id}</p>
                  <p className="mb-2">Listed: {new Date(property.listingCreatedAt).toLocaleDateString()}</p>
                  <p>Views: {property.viewsCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
