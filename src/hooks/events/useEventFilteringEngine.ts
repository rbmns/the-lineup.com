
import { useState, useEffect } from 'react';
import { Event } from '@/types'; 
import { filterEventsByDate } from '@/utils/date-filtering'; 

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

    // Default state - show all events when no filters are actively selected
    if (selectedEventTypes.length === 0 && selectedVenues.length === 0 && !selectedDateFilter && !dateRange) {
      setExactMatches(events);
      setShowNoExactMatchesMessage(false);
      setIsFilterLoading(false);
      return;
    }

    // Apply filters when they are actively selected
    const filteredEvents = events.filter(event => {
      // Event type filter - if no types selected, show all events
      if (selectedEventTypes.length > 0 && event.event_type && !selectedEventTypes.includes(event.event_type)) {
        return false;
      }
      
      // Venue filter - if no venues selected, show all events
      if (selectedVenues.length > 0 && event.venues?.name && !selectedVenues.includes(event.venues.name)) {
        return false;
      }
      
      // Date filter - only apply if a specific date filter is selected
      if (selectedDateFilter || (dateRange && dateRange.from)) {
        const dateFilteredEvents = filterEventsByDate([event], selectedDateFilter, dateRange);
        return dateFilteredEvents.length > 0;
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
