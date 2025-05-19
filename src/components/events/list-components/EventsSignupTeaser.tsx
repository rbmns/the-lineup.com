
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EventsSignupTeaser: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/login', { state: { initialMode: 'register' } });
  };

  return (
    <div className="w-full py-8 my-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="hidden sm:flex h-10 w-10 rounded-full bg-purple-100 items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-lg">Connect with attendees</h3>
            <p className="text-gray-600 mt-1 text-sm">See who's going and make new friends at events near you</p>
          </div>
        </div>
        <div className="flex mt-2 sm:mt-0">
          <Button 
            variant="default" 
            className="bg-black hover:bg-gray-800 px-5"
            onClick={handleSignUp}
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};
