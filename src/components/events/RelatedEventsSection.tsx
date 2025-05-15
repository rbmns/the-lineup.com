
import React from 'react';
import { Event } from '@/types';
import { RelatedEvents } from '@/components/events/related-events/RelatedEvents';

export interface RelatedEventsSectionProps {
  event: Event;
}

export const RelatedEventsSection: React.FC<RelatedEventsSectionProps> = ({ event }) => {
  return (
    <RelatedEvents 
      eventId={event.id}
      eventType={event.event_type || ''}
      // Passing event date for date proximity matching (new)
      date={event.start_date || event.date || ''}
    />
  );
};
