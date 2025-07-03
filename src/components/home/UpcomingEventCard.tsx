
import React from 'react';
import { Event } from '@/types';
import { MasterEventCard } from '@/components/ui/MasterEventCard';
import { MapPin } from 'lucide-react';

interface UpcomingEventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  className?: string;
}

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
  event,
  onClick,
  className,
}) => {
  // Get venue display for main location
  const getVenueDisplay = (): string => {
    if (event.venues?.name) {
      return event.venues.name;
    }
    
    if (event.location) {
      return event.location;
    }
    
    if (event.destination) {
      return event.destination;
    }
    
    return 'Location TBD';
  };

  // Check if we should show destination as additional info
  const shouldShowDestination = () => {
    const venueDisplay = getVenueDisplay();
    return event.destination && event.destination !== venueDisplay;
  };

  return (
    <MasterEventCard
      event={event}
      onClick={onClick}
      className={className}
      showRsvpButtons={false} // Home page cards don't show RSVP buttons
    >
      {/* Show destination if different from main venue display */}
      {shouldShowDestination() && (
        <div className="text-xs text-graphite-grey/70 font-mono flex items-center gap-1 mt-2">
          <MapPin className="h-3 w-3 text-ocean-teal flex-shrink-0" />
          <span>{event.destination}</span>
        </div>
      )}
    </MasterEventCard>
  );
};
