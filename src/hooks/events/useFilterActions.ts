
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useEventTypeFilter } from './useEventTypeFilter';
import { useVenueFilter } from './useVenueFilter';
import { useDateFilter } from './useDateFilter';

export const useFilterActions = (events: any[] = []) => {
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    availableEventTypes,
    showEventTypeFilter,
    setShowEventTypeFilter
  } = useEventTypeFilter(events);

  const {
    selectedVenues,
    setSelectedVenues,
    availableVenues,
    showVenueFilter,
    setShowVenueFilter
  } = useVenueFilter();

  const {
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    showDateFilter,
    setShowDateFilter,
    resetDateFilters
  } = useDateFilter();

  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    resetDateFilters();
  };

  const hasActiveFilters = 
    selectedEventTypes.length > 0 || 
    selectedVenues.length > 0 || 
    !!dateRange || 
    !!selectedDateFilter;

  return {
    // Event type filters
    selectedEventTypes,
    setSelectedEventTypes,
    availableEventTypes,
    showEventTypeFilter,
    setShowEventTypeFilter,
    
    // Venue filters
    selectedVenues,
    setSelectedVenues,
    availableVenues,
    showVenueFilter,
    setShowVenueFilter,
    
    // Date filters
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    showDateFilter,
    setShowDateFilter,
    
    // Common actions
    resetFilters,
    hasActiveFilters
  };
};
