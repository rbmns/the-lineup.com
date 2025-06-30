
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
        <Card className="card-base">
          <CardHeader className="text-center pb-6">
            <div className={`bg-ocean-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
              <span className={isMobile ? 'text-xl' : 'text-2xl'}>👥</span>
            </div>
            <CardTitle className={`text-ocean-deep mb-2 ${isMobile ? 'text-lg' : 'text-h4'}`}>
              Connect with your crew
            </CardTitle>
            <CardDescription className={`text-graphite-grey/80 ${isMobile ? 'text-xs' : 'text-body-small'}`}>
              Sign up to see what your friends are up to and discover events together.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-3">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
