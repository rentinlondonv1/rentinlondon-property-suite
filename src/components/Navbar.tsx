
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth/login');
    } else {
      navigate('/publish');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-rentblue-800">rent<span className="text-rentblue-500">in</span>london</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className="border-transparent text-gray-700 hover:text-rentblue-500 hover:border-rentblue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                to="/properties" 
                className="border-transparent text-gray-700 hover:text-rentblue-500 hover:border-rentblue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Properties
              </Link>
              <Link 
                to="/how-it-works" 
                className="border-transparent text-gray-700 hover:text-rentblue-500 hover:border-rentblue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                How it Works
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            {!user && (
              <Button variant="outline" className="border-rentblue-500 text-rentblue-500 hover:bg-rentblue-50">
                <Link to="/auth/login">Log In</Link>
              </Button>
            )}
            <Button 
              className="bg-rentblue-500 hover:bg-rentblue-600 text-white"
              onClick={handlePublishClick}
            >
              Publish Property
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rentblue-500">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
