
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

const TeaseLoginSignup = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup', { state: { initialMode: 'register' } });
  };

  return (
    <Card className="shadow-md border border-gray-200 overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
      <CardContent className="p-5 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>Join the community</span>
        </h3>
        
        <div className="text-sm text-gray-700">
          <p>Sign up to see who's attending this event and connect with other attendees.</p>
        </div>

        <div className="pt-2">
          <Button 
            onClick={handleSignUp} 
            className="w-full bg-primary hover:bg-primary/90"
          >
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeaseLoginSignup;
