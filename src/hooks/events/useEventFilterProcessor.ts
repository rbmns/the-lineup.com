
import { useMemo } from 'react';
import { Event } from '@/types';
import { filterUpcomingEvents } from '@/utils/date-filtering';
import { useDateFilterProcessor } from './useDateFilterProcessor';

// Extend the Event type to include the optional isExactMatch property
interface EventWithMatch extends Event {
  isExactMatch?: boolean;
}

export const useEventFilterProcessor = (
  filteredEvents: Event[],
  events: Event[],
  selectedDateFilter: string,
  dateRange: any
) => {
  const { applyDateFilters } = useDateFilterProcessor(selectedDateFilter, dateRange);

  // Apply all filters and get displayEvents
  const displayEvents = useMemo(() => {
    // Start with events that already have event type and venue filters applied
    const baseEvents = filteredEvents.length > 0 ? filteredEvents : (events ? filterUpcomingEvents(events) : []);
    
    console.log("Base events count for filtering:", baseEvents.length);
    
    // Then apply date filters
    return applyDateFilters(baseEvents);
  }, [filteredEvents, events, applyDateFilters]);

  // Separate the exact matches from any potential similar matches
  const exactMatches = useMemo(() => {
    return (displayEvents as EventWithMatch[]).filter(event => event.isExactMatch !== false);
  }, [displayEvents]);
  
  return {
    displayEvents,
    exactMatches
  };
};
