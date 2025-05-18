
import { Event } from '@/types';

/**
 * Filters events by venue IDs
 */
export const filterEventsByType = (events: Event[], eventTypes: string[]): Event[] => {
  if (!eventTypes.length) return events;
  
  return events.filter(event => 
    event.event_type && eventTypes.includes(event.event_type)
  );
};

/**
 * Filters events by venue IDs
 */
export const filterEventsByVenue = (events: Event[], venueIds: string[]): Event[] => {
  if (!venueIds.length) return events;
  
  return events.filter(event => 
    event.venue_id && venueIds.includes(event.venue_id)
  );
};
