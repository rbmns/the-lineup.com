
import React from 'react';
import { Event } from '@/types';
import RelatedEventCard from './RelatedEventCard';

interface RelatedEventsGridProps {
  events: Event[];
  referenceEventType?: string;
}

export const RelatedEventsGrid: React.FC<RelatedEventsGridProps> = ({ 
  events, 
  referenceEventType 
}) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No related events found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map(event => (
        <RelatedEventCard 
          key={event.id} 
          event={event}
          isSameType={event.event_type === referenceEventType}
        />
      ))}
    </div>
  );
};
