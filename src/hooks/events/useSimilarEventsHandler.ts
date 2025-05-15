
import { useEffect } from 'react';
import { Event } from '@/types';

export const useSimilarEventsHandler = (
  exactMatches: Event[],
  hasActiveFilters: boolean,
  selectedEventTypes: string[],
  fetchSimilarEvents: (eventTypes: string[]) => Promise<Event[]>,
  setSimilarEvents: (events: Event[]) => void
) => {
  // Handle similar events loading
  useEffect(() => {
    const loadSimilarEvents = async () => {
      if (exactMatches.length === 0 && hasActiveFilters && selectedEventTypes.length > 0) {
        console.log("Loading similar events based on event types:", selectedEventTypes);
        try {
          // Pass the array of event types directly
          const similarEvents = await fetchSimilarEvents(selectedEventTypes);
          setSimilarEvents(similarEvents);
        } catch (error) {
          console.error("Error fetching similar events:", error);
          setSimilarEvents([]);
        }
      } else if (!hasActiveFilters || exactMatches.length > 0) {
        // Clear similar events when no filters active or we have exact matches
        setSimilarEvents([]);
      }
    };
    
    loadSimilarEvents();
  }, [exactMatches, hasActiveFilters, selectedEventTypes, fetchSimilarEvents, setSimilarEvents]);
};
