
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
    // Update: Changed behavior to show all events when no categories are selected
    // (instead of showing no events)
    let filtered = events;
    
    // Apply event type filter if some event types are selected
    if (selectedCategories.length > 0 && selectedCategories.length < allEventTypes.length) {
      filtered = events.filter(event => 
        event.event_type && selectedCategories.includes(event.event_type)
      );
    }
    
    // Apply venue filter if selected
    if (selectedVenues.length > 0) {
      filtered = filterEventsByVenue(filtered, selectedVenues);
    }
    
    // Apply date filter if selected
    if (dateRange || selectedDateFilter) {
      filtered = filterEventsByDate(filtered, selectedDateFilter, dateRange);
    }
    
    return filtered;
  }, [events, selectedCategories, allEventTypes.length, selectedVenues, dateRange, selectedDateFilter]);

  return filteredEvents;
};
