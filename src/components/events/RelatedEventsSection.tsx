
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
      venueId={event.venue_id || ''} 
      eventType={event.event_type || ''}
      tags={event.tags}
      vibe={event.vibe}
    />
  );
};
