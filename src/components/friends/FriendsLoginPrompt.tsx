
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export const FriendsLoginPrompt: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className={`container mx-auto px-4 ${isMobile ? 'py-2' : 'py-4'}`}>
      <div className="max-w-md mx-auto">
        <div className={`auth-container text-center ${isMobile ? 'mx-2' : ''}`}>
          <div className={isMobile ? 'mb-4' : 'mb-6'}>
            <div className={`bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
              <span className={isMobile ? 'text-xl' : 'text-2xl'}>👥</span>
            </div>
            <h2 className={`auth-heading ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Sign up or in to see others
            </h2>
            <p className={`auth-subtext leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Connect with friends and discover new things in your area.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/signup')} 
              className="w-full btn-primary"
              size={isMobile ? "default" : "lg"}
            >
              Sign Up
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline"
              className="w-full btn-outline"
              size={isMobile ? "default" : "lg"}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
