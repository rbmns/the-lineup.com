import { useCallback } from 'react';
import { filterEventsByDateRange } from '@/utils/date-filtering';
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
    
    if (selectedDateFilter) {
      console.log(`Applying date filter: ${selectedDateFilter} to ${events.length} events`);
      filtered = events.filter(event => filterEventsByDateRange(event, selectedDateFilter, dateRange));
      console.log(`After date filter: ${filtered.length} events remain`);
    } else if (dateRange?.from) {
      console.log(`Applying date range filter: from ${dateRange.from} to ${dateRange.to || 'unspecified'}`);
      filtered = events.filter(event => filterEventsByDateRange(event, selectedDateFilter, dateRange));
      console.log(`After date range filter: ${filtered.length} events remain`);
    }
    return filtered;
  }, [selectedDateFilter, dateRange]);

  return { applyDateFilters };
};
