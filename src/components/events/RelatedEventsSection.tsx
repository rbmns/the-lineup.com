
import React from 'react';
import { Event } from '@/types';
import { RelatedEvents } from '@/components/events/related-events/RelatedEvents';

export interface RelatedEventsSectionProps {
  event: Event;
}

export const RelatedEventsSection: React.FC<RelatedEventsSectionProps> = ({ event }) => {
  // Pass the eventId and venueId props since RelatedEvents expects these
  return <RelatedEvents eventId={event.id} venueId={event.venue_id || ''} />;
};
