
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

export const FriendsLoginPrompt: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className={`container mx-auto px-4 ${isMobile ? 'py-2' : 'py-4'}`}>
      <div className="max-w-md mx-auto">
        <Card className="bg-pure-white border border-mist-grey shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className={`bg-ocean-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
              <span className={`${isMobile ? 'text-xl' : 'text-2xl'} text-ocean-teal`}>👥</span>
            </div>
            <CardTitle className={`text-graphite-grey mb-2 font-montserrat ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Connect with your crew
            </CardTitle>
            <CardDescription className={`text-graphite-grey/80 font-lato ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Sign up to see what your friends are up to and discover events together.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/signup')} 
                className="w-full bg-ocean-teal hover:bg-ocean-teal/90 text-pure-white font-montserrat"
                size="default"
              >
                Sign Up
              </Button>
              <Button 
                onClick={() => navigate('/login')} 
                variant="outline"
                className="w-full border-ocean-teal text-ocean-teal hover:bg-ocean-teal hover:text-pure-white font-montserrat"
                size="default"
              >
                Log In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
