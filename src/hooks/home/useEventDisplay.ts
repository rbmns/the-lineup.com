
import { Event } from '@/types';
import { filterUpcomingEvents } from '@/utils/dateUtils';
import { useMemo } from 'react';

interface UseEventDisplayProps {
  events: Event[] | undefined;
  combinedResults: Event[] | null;
  similarEvents: Event[];
  noResultsFound: boolean;
  searchQuery: string;
  selectedEventTypes: string[];
}

export const useEventDisplay = ({
  events,
  combinedResults,
  similarEvents,
  noResultsFound,
  searchQuery,
  selectedEventTypes
}: UseEventDisplayProps) => {
  
  // Determine which events to display based on filters and search results
  const displayEvents = useMemo(() => {
    if (combinedResults && combinedResults.length > 0) {
      return combinedResults;
    } else if (similarEvents.length > 0 && noResultsFound) {
      return similarEvents;
    } else if (!searchQuery && !selectedEventTypes.length && events) {
      return filterUpcomingEvents(events);
    } else {
      return [];
    }
  }, [combinedResults, similarEvents, noResultsFound, searchQuery, selectedEventTypes, events]);

  // Check if we should show scroll arrow based on search state
  const showScrollArrow = displayEvents.length > 0 && Boolean(searchQuery || selectedEventTypes.length > 0);

  return {
    displayEvents,
    showScrollArrow
  };
};
