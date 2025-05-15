
import React from 'react';
import { Event } from '@/types';
import RelatedEventCard from './RelatedEventCard';

interface RelatedEventsGridProps {
  events: Event[];
}

export const RelatedEventsGrid: React.FC<RelatedEventsGridProps> = ({ events }) => {
  // Ensure we're working with a stable array
  const eventsArray = Array.isArray(events) ? events : [];
  
  // Always show up to 2 events in a single row
  const eventsToShow = eventsArray.slice(0, 2);
  
  // If no events to show, display a message
  if (eventsToShow.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-md text-center">
        <p className="text-gray-500">No upcoming related events found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {eventsToShow.map((event) => (
        <div key={event.id} className="w-full">
          <RelatedEventCard event={event} />
        </div>
      ))}
    </div>
  );
};

export default RelatedEventsGrid;
