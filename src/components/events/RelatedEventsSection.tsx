
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
      startDate={event.start_date || ''}
      tags={event.tags}
      vibe={event.vibe}
    />
  );
};
