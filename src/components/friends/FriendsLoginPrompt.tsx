
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const FriendsLoginPrompt: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-4">Sign up or in to see others</h2>
          <p className="text-gray-600 mb-6">
            Connect with friends and discover new things in your area.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/signup')} 
              variant="primary"
              className="w-full"
            >
              Sign Up
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              variant="default"
              className="w-full"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
