
import React from 'react';
import { Event } from '@/types';
import RelatedEventCard from './RelatedEventCard';
import { useNavigate } from 'react-router-dom';
import { navigateToEvent } from '@/utils/navigationUtils';

interface RelatedEventsGridProps {
  events: Event[];
  referenceEventType?: string;
  referenceEventId?: string;
}

export const RelatedEventsGrid: React.FC<RelatedEventsGridProps> = ({ 
  events, 
  referenceEventType,
  referenceEventId
}) => {
  const navigate = useNavigate();
  
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No related events found.</p>
      </div>
    );
  }
  
  // Handle navigation with URL parameters
  const handleEventClick = (event: Event) => {
    // Build URL with source parameter
    navigateToEvent(event.id, navigate, event, true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map(event => (
        <RelatedEventCard 
          key={event.id} 
          event={event}
          onClick={() => handleEventClick(event)}
        />
      ))}
    </div>
  );
};

export default RelatedEventsGrid;
