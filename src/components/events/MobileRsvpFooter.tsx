
import React from 'react';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';

interface MobileRsvpFooterProps {
  isAuthenticated: boolean;
  isMobile: boolean;
  rsvpStatus?: 'Going' | 'Interested';
  handleRsvp: (status: 'Going' | 'Interested') => void;
  rsvpLoading: boolean;
}

export const MobileRsvpFooter: React.FC<MobileRsvpFooterProps> = ({
  isAuthenticated,
  isMobile,
  rsvpStatus,
  handleRsvp,
  rsvpLoading
}) => {
  // Only show on mobile and for authenticated users
  if (!isAuthenticated || !isMobile) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-50 animate-slide-in-bottom shadow-lg">
      <div className="container mx-auto max-w-md">
        <EventRsvpButtons 
          currentStatus={rsvpStatus}
          onRsvp={handleRsvp}
          loading={rsvpLoading}
          className="w-full"
          size="lg"
        />
      </div>
    </div>
  );
};

export default MobileRsvpFooter;
