
import React from 'react';
import { Event } from '@/types';
import RelatedEventCard from './RelatedEventCard';

interface RelatedEventsGridProps {
  events: Event[];
}

export const RelatedEventsGrid: React.FC<RelatedEventsGridProps> = ({ events }) => {
  // Ensure we're working with a stable array
  const eventsArray = Array.isArray(events) ? events : [];
  
  // Limit to maximum of 3 events to show in a single row
  const limitedEvents = eventsArray.slice(0, 3);
  
  // Check if we have enough events
  const hasEnoughEvents = limitedEvents.length >= 2;
  
  // If no events to show, display a message
  if (limitedEvents.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-md text-center">
        <p className="text-gray-500">No upcoming related events found.</p>
      </div>
    );
  }
  
  // If we have fewer than 2 events, show a message but still display what we have
  if (!hasEnoughEvents) {
    console.warn(`Only found ${limitedEvents.length} related event, fewer than the minimum 2 requested`);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {limitedEvents.map((event) => (
        <div key={event.id} className="w-full">
          <RelatedEventCard event={event} />
        </div>
      ))}
    </div>
  );
};

export default RelatedEventsGrid;
