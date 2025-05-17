
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventsTeaserProps {
  className?: string;
}

export const EventsTeaser: React.FC<EventsTeaserProps> = ({ className }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignUpClick = () => {
    // Track the click event
    trackEvent('teaser_signup_click', {
      location: 'events_page',
      component: 'events_teaser'
    });
    
    navigate('/login', { state: { initialMode: 'register' } });
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Calendar className="h-6 w-6 text-purple-500" />
        </div>

        <div className="flex-grow">
          <h3 className="font-medium text-gray-900">Be part of the community</h3>
          <p className="text-sm text-gray-600">Sign up to save your liked events and see where your friends are going</p>
        </div>

        <div className="flex items-center mt-3 sm:mt-0">
          <Button 
            onClick={handleSignUpClick}
            className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-medium text-sm"
          >
            {isMobile ? "Create account" : "Create an account - it's free"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsTeaser;
