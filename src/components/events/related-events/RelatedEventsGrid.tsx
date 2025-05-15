
import React from 'react';
import { Event } from '@/types';
import RelatedEventCard from './RelatedEventCard';

interface RelatedEventsGridProps {
  events: Event[];
}

export const RelatedEventsGrid: React.FC<RelatedEventsGridProps> = ({ events }) => {
  // If no events, return null (component will be hidden by parent)
  if (!events || events.length === 0) {
    return null;
  }

  // Ensure we're working with a stable array
  const eventsArray = Array.isArray(events) ? events : [];
  
  // Always show up to 3 events in a single row
  const eventsToShow = eventsArray.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {eventsToShow.map((event) => (
        <div key={event.id} className="w-full">
          <RelatedEventCard event={event} />
        </div>
      ))}
    </div>
  );
};

export default RelatedEventsGrid;
