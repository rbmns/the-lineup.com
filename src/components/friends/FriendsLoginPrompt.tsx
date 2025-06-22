
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const FriendsLoginPrompt: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border-2 border-secondary-50 shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-vibrant-seafoam/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Sign up or in to see others
            </h2>
            <p className="text-neutral leading-relaxed">
              Connect with friends and discover new things in your area.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/signup')} 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              Sign Up
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline"
              className="w-full border-primary/20 text-primary hover:bg-primary/5"
              size="lg"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
