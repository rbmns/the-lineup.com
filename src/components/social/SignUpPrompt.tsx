
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

export const SignUpPrompt: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <Card className="border-seafoam-green bg-seafoam-green/5">
      <CardContent className="p-4">
        <div className="text-center">
          <UserPlus className="h-8 w-8 text-seafoam-green mx-auto mb-2" />
          <p className="text-sm text-ocean-deep mb-3">Join the community!</p>
          <Button 
            size="sm" 
            className="w-full"
            onClick={handleSignUpClick}
          >
            Sign Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
