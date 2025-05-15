
import React from 'react';
import { Event } from '@/types';
import RelatedEventCard from './RelatedEventCard';

interface RelatedEventsGridProps {
  events: Event[];
}

export const RelatedEventsGrid: React.FC<RelatedEventsGridProps> = ({ events }) => {
  // If no events, show a message
  if (!events || events.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-500">No similar events found at the moment</p>
        <p className="text-sm text-gray-400 mt-1">Check back later for more events</p>
      </div>
    );
  }

  // Ensure we're working with a stable array
  const eventsArray = Array.isArray(events) ? events : [];
  
  // Show up to 3 events if available
  const eventsToShow = eventsArray.slice(0, 3);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
      {eventsToShow.map((event) => (
        <RelatedEventCard 
          key={event.id} 
          event={event} 
        />
      ))}
    </div>
  );
};

export default RelatedEventsGrid;
