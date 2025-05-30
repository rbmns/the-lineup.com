
import { Event } from '@/types';

/**
 * Filters events by venue IDs
 */
export const filterEventsByType = (events: Event[], eventTypes: string[]): Event[] => {
  if (!eventTypes.length) return events;
  
  return events.filter(event => 
    event.event_category && eventTypes.includes(event.event_category)
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
