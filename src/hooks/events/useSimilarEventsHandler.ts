
import { useEffect } from 'react';
import { Event } from '@/types';

// Define the type for the fetchSimilarEvents function
type FetchSimilarEvents = (eventTypes: string[], eventsData?: Event[]) => Promise<Event[]>;

export const useSimilarEventsHandler = (
  exactMatches: Event[],
  hasActiveFilters: boolean,
  selectedEventTypes: string[],
  fetchSimilarEvents: FetchSimilarEvents,
  setSimilarEvents: (events: Event[]) => void
) => {
  useEffect(() => {
    // Clear similar events when there are no filters or when there are exact matches
    if (!hasActiveFilters || exactMatches.length > 0) {
      setSimilarEvents([]);
      return;
    }

    // Only fetch similar events if we have event types to filter by
    if (selectedEventTypes.length > 0) {
      const loadSimilarEvents = async () => {
        try {
          // Fetch similar events based on selected event types
          const similar = await fetchSimilarEvents(selectedEventTypes);
          setSimilarEvents(similar);
        } catch (err) {
          console.error('Error fetching similar events:', err);
          setSimilarEvents([]);
        }
      };

      loadSimilarEvents();
    } else {
      setSimilarEvents([]);
    }
  }, [
    exactMatches.length,
    hasActiveFilters,
    selectedEventTypes,
    fetchSimilarEvents,
    setSimilarEvents
  ]);
};
