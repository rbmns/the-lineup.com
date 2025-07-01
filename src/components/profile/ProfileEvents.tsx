
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
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500 font-inter leading-7">Loading events...</div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500 font-inter leading-7">No events found.</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none overflow-hidden">
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="w-full">
            <EventCardList 
              event={event} 
              showRsvpStatus={true} 
              onRsvp={onRsvp}
              className="mx-0 px-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileEvents;
