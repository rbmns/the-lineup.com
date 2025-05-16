
import { Event } from '@/types';

/**
 * Filter events based on active filters and search query
 */
export const filterEvents = (
  events: Event[],
  activeFilters: Record<string, boolean>,
  searchQuery: string = ''
): Event[] => {
  // Get the active filter IDs
  const activeFilterIds = Object.entries(activeFilters)
    .filter(([_, active]) => active)
    .map(([id]) => id);
    
  // If no filters or search are active, return all events
  if (activeFilterIds.length === 0 && !searchQuery) {
    return events;
  }
  
  // Apply filtering
  return events.filter(event => {
    // If category filters are active, check if the event matches any of them
    if (activeFilterIds.length > 0) {
      if (!event.event_type) return false;
      
      const eventTypeId = event.event_type.toLowerCase().replace(/\s+/g, '-');
      if (!activeFilterIds.includes(eventTypeId)) return false;
    }
    
    // If search query is active, check if the event title includes it
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const title = (event.title || '').toLowerCase();
      const description = (event.description || '').toLowerCase();
      const eventType = (event.event_type || '').toLowerCase();
      
      if (!title.includes(query) && 
          !description.includes(query) && 
          !eventType.includes(query)) {
        return false;
      }
    }
    
    return true;
  });
};
