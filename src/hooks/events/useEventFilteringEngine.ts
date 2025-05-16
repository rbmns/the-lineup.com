
import { useState, useEffect } from 'react';
import { Event } from '@/types'; // Assuming Event type is available
import { filterEventsByDateRange } from '@/utils/dateUtils'; // Ensure this utility is correct

interface UseEventFilteringEngineProps {
  events: Event[] | undefined;
  selectedEventTypes: string[];
  selectedVenues: string[];
  dateRange: any; // from react-day-picker DateRange
  selectedDateFilter: string;
  hasActiveFilters: boolean;
  setIsFilterLoading: (loading: boolean) => void;
}

export const useEventFilteringEngine = ({
  events,
  selectedEventTypes,
  selectedVenues,
  dateRange,
  selectedDateFilter,
  hasActiveFilters,
  setIsFilterLoading,
}: UseEventFilteringEngineProps) => {
  const [exactMatches, setExactMatches] = useState<Event[]>([]);
  const [showNoExactMatchesMessage, setShowNoExactMatchesMessage] = useState(false);

  useEffect(() => {
    if (!events) {
      setExactMatches([]);
      setShowNoExactMatchesMessage(false);
      return;
    }

    setIsFilterLoading(true);
    setShowNoExactMatchesMessage(false);

    const filteredEvents = events.filter(event => {
      if (selectedEventTypes.length > 0 && event.event_type && !selectedEventTypes.includes(event.event_type)) {
        return false;
      }
      if (selectedVenues.length > 0 && event.venues?.name && !selectedVenues.includes(event.venues.name)) {
        return false;
      }
      if (selectedDateFilter || dateRange) {
        const isInRange = filterEventsByDateRange(event, selectedDateFilter, dateRange);
        if (!isInRange) {
          return false;
        }
      }
      return true;
    });

    setExactMatches(filteredEvents);
    setShowNoExactMatchesMessage(filteredEvents.length === 0 && hasActiveFilters);

    // Simulate loading delay for UI effect - can be removed if not desired
    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 300);
    return () => clearTimeout(timer);

  }, [
    events,
    selectedEventTypes,
    selectedVenues,
    dateRange,
    selectedDateFilter,
    hasActiveFilters,
    setIsFilterLoading,
  ]);

  return {
    exactMatches,
    showNoExactMatchesMessage,
  };
};
