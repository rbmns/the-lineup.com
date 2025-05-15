
import { Event } from '@/types';

/**
 * Filter events by event type
 */
export const filterEventsByType = (events: Event[], eventTypes: string[]): Event[] => {
  if (!eventTypes || eventTypes.length === 0) return events;
  
  return events.filter(event => 
    event.event_type && eventTypes.includes(event.event_type)
  );
};

/**
 * Filter events by venue
 */
export const filterEventsByVenue = (events: Event[], venueIds: string[]): Event[] => {
  if (!venueIds || venueIds.length === 0) return events;
  
  return events.filter(event => {
    // Check if venue exists and venue_id matches one in the filter
    return event.venue_id && venueIds.includes(event.venue_id);
  });
};
