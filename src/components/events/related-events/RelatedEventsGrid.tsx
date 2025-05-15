
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
  
  // Show up to 3 events in a single row
  const eventsToShow = eventsArray.slice(0, 3);

  return (
    <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3">
      {eventsToShow.map((event) => (
        <div key={event.id} className="w-[280px] flex-shrink-0 md:w-full">
          <RelatedEventCard event={event} />
        </div>
      ))}
    </div>
  );
};

export default RelatedEventsGrid;
