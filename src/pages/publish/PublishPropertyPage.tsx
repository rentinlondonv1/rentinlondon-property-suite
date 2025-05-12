
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PublishPropertyPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Property submission",
      description: "This feature is coming soon. Your property will be published later.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Publish Your Property</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 mb-6">
              <p>Welcome to the property submission page. This feature is coming soon.</p>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-rentblue-500 hover:bg-rentblue-600"
              >
                Submit Property
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublishPropertyPage;
