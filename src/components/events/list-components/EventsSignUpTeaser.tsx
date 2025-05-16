
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EventsSignUpTeaserProps {
  showSignUpButton?: boolean;
}

export const EventsSignUpTeaser: React.FC<EventsSignUpTeaserProps> = ({
  showSignUpButton = true
}) => {
  const navigate = useNavigate();
  
  const handleSignUp = () => {
    navigate('/login');
  };
  
  return (
    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6 my-6 shadow-sm">
      <h3 className="text-lg font-medium text-purple-800 mb-2">
        Sign up to access all features
      </h3>
      <p className="text-purple-700 mb-4">
        Create an account to RSVP to events, connect with friends, and get personalized recommendations.
      </p>
      
      {showSignUpButton && (
        <Button 
          onClick={handleSignUp}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Create free account
        </Button>
      )}
    </div>
  );
};

export default EventsSignUpTeaser;
