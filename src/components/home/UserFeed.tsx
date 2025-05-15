
import React from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { useAuth } from '@/contexts/AuthContext';
import { useEventNavigation } from '@/hooks/useEventNavigation';

interface UserFeedProps {
  events: Event[];
  handleRsvpAction: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
}

export const UserFeed: React.FC<UserFeedProps> = ({ events, handleRsvpAction }) => {
  const { isAuthenticated } = useAuth();
  const { navigateToEvent } = useEventNavigation();
  
  const handleEventClick = (event: Event) => {
    console.log("UserFeed: Navigating to event using SEO-friendly URL");
    // Use the navigation hook for consistent URL structure
    navigateToEvent({
      ...event,
      destination: event.destination,
      slug: event.slug
    });
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id}>
          <EventCard
            event={event}
            onRsvp={handleRsvpAction}
            showRsvpButtons={isAuthenticated}
            onClick={() => handleEventClick(event)}
          />
        </div>
      ))}
    </div>
  );
};
