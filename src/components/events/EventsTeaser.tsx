
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';

interface EventsTeaserProps {
  className?: string;
}

export const EventsTeaser: React.FC<EventsTeaserProps> = ({ className }) => {
  const navigate = useNavigate();

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
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Calendar className="h-6 w-6 text-purple-500" />
        </div>

        <div className="flex-grow">
          <h3 className="font-medium text-gray-900">Connect with attendees</h3>
          <p className="text-sm text-gray-600">Sign up to save your RSVPs, add to your calendar and see who's going</p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSignUpClick}
            className="bg-black hover:bg-gray-800 text-white font-medium"
          >
            Create an account - it's free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsTeaser;
