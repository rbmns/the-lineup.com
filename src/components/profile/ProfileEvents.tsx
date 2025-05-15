
import React from 'react';
import { Event } from '@/types';
import EventCardList from '@/components/events/EventCardList';

interface ProfileEventsProps {
  events: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
}

const ProfileEvents = ({ events, isLoading, onRsvp }: ProfileEventsProps) => {
  if (isLoading) {
    return <div className="text-gray-500 font-inter leading-7">Loading events...</div>;
  }

  if (!events || events.length === 0) {
    return <div className="text-gray-500 font-inter leading-7">No events found.</div>;
  }

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <div key={event.id} className="block">
          <EventCardList 
            event={event} 
            showRsvpStatus={true} 
            onRsvp={onRsvp}
          />
        </div>
      ))}
    </div>
  );
};

export default ProfileEvents;
