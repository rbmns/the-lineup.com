
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
  dateRange?: DateRange;
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
    // If no categories selected, show all events (changed behavior)
    if (selectedCategories.length === 0) {
      let filtered = events;
      
      // Apply venue filter if selected
      if (selectedVenues.length > 0) {
        filtered = filterEventsByVenue(filtered, selectedVenues);
      }
      
      // Apply date filter if selected
      if (dateRange || selectedDateFilter) {
        filtered = filterEventsByDate(filtered, selectedDateFilter, dateRange);
      }
      
      return filtered;
    }
    
    // Show all events if all categories are selected
    if (selectedCategories.length === allEventTypes.length) {
      let filtered = events;
      
      // Apply venue filter if selected
      if (selectedVenues.length > 0) {
        filtered = filterEventsByVenue(filtered, selectedVenues);
      }
      
      // Apply date filter if selected
      if (dateRange || selectedDateFilter) {
        filtered = filterEventsByDate(filtered, selectedDateFilter, dateRange);
      }
      
      return filtered;
    }
    
    // Apply event type filter if some event types are selected
    let filtered = events.filter(event => 
      event.event_type && selectedCategories.includes(event.event_type)
    );
    
    // Apply venue filter
    if (selectedVenues.length > 0) {
      filtered = filterEventsByVenue(filtered, selectedVenues);
    }
    
    // Apply date filter
    if (dateRange || selectedDateFilter) {
      filtered = filterEventsByDate(filtered, selectedDateFilter, dateRange);
    }
    
    return filtered;
  }, [events, selectedCategories, allEventTypes.length, selectedVenues, dateRange, selectedDateFilter]);

  return filteredEvents;
};
