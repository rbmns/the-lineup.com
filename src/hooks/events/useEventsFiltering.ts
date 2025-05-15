
import { Event } from '@/types';
import { useFilterActions } from './useFilterActions';
import { useEventFiltersLogic } from './useEventFiltersLogic';
import { useSimilarEvents } from './useSimilarEvents';

export const useEventsFiltering = (events: Event[] | undefined = [], userId: string | undefined = undefined) => {
  // Get filter state and actions
  const filterActions = useFilterActions(events);
  
  // Get filtering logic
  const { filteredEvents, isFilterLoading } = useEventFiltersLogic(
    events,
    userId,
    filterActions.selectedEventTypes,
    filterActions.selectedVenues,
    filterActions.dateRange,
    filterActions.selectedDateFilter
  );

  // Set up similar events functionality
  const { fetchSimilarEvents, isLoading: isSimilarEventsLoading } = useSimilarEvents(
    filterActions.selectedEventTypes, 
    filterActions.selectedVenues
  );
  
  return {
    // Filter state and actions
    ...filterActions,
    
    // Filtered events results
    filteredEvents,
    
    // Loading states
    isFilterLoading: isFilterLoading || isSimilarEventsLoading,
    
    // Additional functionality
    fetchSimilarEvents
  };
};
