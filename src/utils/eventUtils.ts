
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
    // Check if venue exists and has a name or id that matches
    if (!event.venues) return false;
    
    // Handle venue filtering by name
    if (typeof event.venues === 'object' && 'name' in event.venues) {
      return venueIds.includes(event.venues.name);
    }
    
    // Handle venue filtering by ID
    if (event.venue_id) {
      return venueIds.includes(event.venue_id);
    }
    
    return false;
  });
};
