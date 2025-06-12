import React from 'react';
import { Event } from '@/types';
import { EventCard } from '@/components/EventCard';
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
    console.log(`UserFeed: Navigating to event with ID: ${event.id}`);
    // Use the consistent navigation hook instead of direct navigation
    navigateToEvent(event);
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id}>
          <EventCard
            event={event}
            onRsvp={handleRsvpAction}
            showRsvpButtons={isAuthenticated}
            onClick={handleEventClick}
          />
        </div>
      ))}
    </div>
  );
};
