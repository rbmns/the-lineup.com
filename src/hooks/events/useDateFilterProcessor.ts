import { useCallback } from 'react';
import { filterEventsByDate } from '@/utils/date-filtering';
import { DateRange } from 'react-day-picker';
import { Event } from '@/types';

export const useDateFilterProcessor = (selectedDateFilter: string, dateRange?: DateRange) => {
  const applyDateFilters = useCallback((events: Event[]) => {
    // If no date filters are applied, return all events unchanged
    if (!selectedDateFilter && (!dateRange || !dateRange.from)) {
      console.log("No date filters applied, returning all events:", events.length);
      return events;
    }
    
    let filtered = events;
    
    // Use the combined filter function that handles both date filters and date ranges
    filtered = filterEventsByDate(events, selectedDateFilter, dateRange);
    console.log(`After date filtering: ${filtered.length} events remain`);
    
    return filtered;
  }, [selectedDateFilter, dateRange]);

  return { applyDateFilters };
};
