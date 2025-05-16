
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface SignUpTeaserProps {
  minimal?: boolean;
}

export const SignUpTeaser: React.FC<SignUpTeaserProps> = ({ minimal = false }) => {
  const navigate = useNavigate();
  
  const handleSignUp = () => {
    navigate('/login');
  };
  
  if (minimal) {
    return (
      <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
        <p className="text-sm text-gray-600 mb-2">
          Sign in to RSVP to events
        </p>
        <Button size="sm" onClick={handleSignUp}>
          Sign in
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium text-purple-800 mb-2">
        Ready to join the fun?
      </h3>
      <p className="text-purple-700 mb-4">
        Create an account to RSVP to events, connect with friends, and get personalized event suggestions.
      </p>
      <Button 
        onClick={handleSignUp}
        className="bg-purple-600 hover:bg-purple-700"
      >
        Create free account
      </Button>
    </div>
  );
};

export default SignUpTeaser;
