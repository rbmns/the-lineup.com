
import { useMemo } from 'react';
import { Event } from '@/types';
import { filterEventsByVenue } from '@/utils/eventUtils';
import { filterEventsByDate } from '@/utils/date-filtering';
import { DateRange } from 'react-day-picker';

interface UseFilteredEventsProps {
  events: Event[];
  selectedCategories: string[];
  allEventTypes: string[];
  selectedVenues: string[];
  dateRange?: DateRange | undefined;
  selectedDateFilter: string;
}

export const useFilteredEvents = ({
  events,
  selectedCategories,
  allEventTypes,
  selectedVenues,
  dateRange,
  selectedDateFilter
}: UseFilteredEventsProps) => {
  // Filter events based on all filters
  const filteredEvents = useMemo(() => {
    // If no categories selected, show no events 
    // (this is different from the "show all when all selected" behavior)
    if (selectedCategories.length === 0) {
      console.log("No categories selected, showing no events");
      return [];
    }
    
    let filtered = events;
    
    // Apply event type filter if not all event types are selected
    if (selectedCategories.length < allEventTypes.length) {
      console.log("Some categories selected, filtering by:", selectedCategories);
      filtered = events.filter(event => 
        event.event_type && selectedCategories.includes(event.event_type)
      );
    } else {
      console.log("All categories selected, showing all events");
    }
    
    // Apply venue filter if selected
    if (selectedVenues.length > 0) {
      console.log("Filtering by venues:", selectedVenues);
      filtered = filterEventsByVenue(filtered, selectedVenues);
    }
    
    // Apply date filter if selected
    if (dateRange || selectedDateFilter) {
      console.log("Filtering by date:", { dateRange, selectedDateFilter });
      filtered = filterEventsByDate(filtered, selectedDateFilter, dateRange);
    }
    
    return filtered;
  }, [events, selectedCategories, allEventTypes.length, selectedVenues, dateRange, selectedDateFilter]);

  return filteredEvents;
};
