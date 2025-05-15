
import React from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserFeedProps {
  events: Event[];
  handleRsvpAction: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
}

export const UserFeed: React.FC<UserFeedProps> = ({ events, handleRsvpAction }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleEventClick = (event: Event) => {
    console.log(`UserFeed: Navigating to event with ID: ${event.id}`);
    // Use direct navigation to event ID for consistency
    if (event && event.id) {
      navigate(`/events/${event.id}`);
    } else {
      console.error("Cannot navigate: Missing event ID", event);
    }
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
