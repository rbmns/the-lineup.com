
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useVenueData } from '@/hooks/events/useVenueData';
import { useEventTypeData } from '@/hooks/events/useEventTypeData';
import { useCategoryFilterSelection } from '@/hooks/events/useCategoryFilterSelection';
import { useEventFilterState } from '@/hooks/events/useEventFilterState';
import { useFilteredEvents } from '@/hooks/events/useFilteredEvents';
import { useSimilarEventsHandler } from '@/hooks/events/useSimilarEventsHandler';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import { Event } from '@/types';

interface EventsDataProviderProps {
  children: (props: {
    events: Event[];
    filteredEvents: Event[];
    similarEvents: Event[];
    eventsLoading: boolean;
    isVenuesLoading: boolean;
    isFilterLoading: boolean;
    allEventTypes: string[];
    selectedCategories: string[];
    toggleCategory: (type: string) => void;
    selectAll: () => void;
    deselectAll: () => void;
    isNoneSelected: boolean;
    hasActiveFilters: boolean;
    showAdvancedFilters: boolean;
    toggleAdvancedFilters: () => void;
    dateRange: any;
    setDateRange: (range: any) => void;
    selectedDateFilter: string;
    setSelectedDateFilter: (filter: string) => void;
    venues: Array<{ value: string, label: string }>;
    selectedVenues: string[];
    setSelectedVenues: (venues: string[]) => void;
    locations: Array<{ value: string, label: string }>;
    hasAdvancedFilters: boolean;
    handleRemoveVenue: (venue: string) => void;
    handleClearDateFilter: () => void;
    resetFilters: () => void;
    handleRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
    showRsvpButtons: boolean;
    loadingEventId?: string | null;
  }) => React.ReactNode;
}

export const EventsDataProvider: React.FC<EventsDataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  
  // Get venue data
  const { venues, locations, isVenuesLoading } = useVenueData();
  
  // Get event type data
  const { allEventTypes } = useEventTypeData(events);
  
  // Navigation history for filter state persistence
  const { saveFilterState, getLastFilterState } = useNavigationHistory();
  
  // Event filter state management
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    showAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter
  } = useEventFilterState();
  
  // Filter events by selected event types - all selected by default
  const {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected
  } = useCategoryFilterSelection(allEventTypes);
  
  // Keep the category filter and event type filter in sync
  useEffect(() => {
    setSelectedEventTypes(selectedCategories);
  }, [selectedCategories, setSelectedEventTypes]);
  
  // Restore filter state when navigating back from event detail
  useEffect(() => {
    if (location.state?.fromEventDetail && location.state?.restoreFilters) {
      console.log("Restoring filter state from navigation:", location.state?.filterState);
      
      // Restore from location state if available
      const filterState = location.state?.filterState || getLastFilterState();
      
      if (filterState) {
        // Restore event type filters
        if (filterState.eventTypes && Array.isArray(filterState.eventTypes)) {
          setSelectedEventTypes(filterState.eventTypes);
        }
        
        // Restore venue filters
        if (filterState.venues && Array.isArray(filterState.venues)) {
          setSelectedVenues(filterState.venues);
        }
        
        // Restore date filters
        if (filterState.dateRange) {
          setDateRange(filterState.dateRange);
        }
        
        if (filterState.dateFilter) {
          setSelectedDateFilter(filterState.dateFilter);
        }
        
        console.log("Filter state restored successfully");
      }
    }
  }, [location.state, setSelectedEventTypes, setSelectedVenues, setDateRange, setSelectedDateFilter, getLastFilterState]);
  
  // Save filter state whenever it changes
  useEffect(() => {
    // Only save when on the events page and filters have been initialized
    if (location.pathname === '/events') {
      const filterState = {
        eventTypes: selectedCategories,
        venues: selectedVenues,
        dateRange: dateRange,
        dateFilter: selectedDateFilter
      };
      
      saveFilterState(filterState);
    }
  }, [
    location.pathname, 
    selectedCategories, 
    selectedVenues, 
    dateRange, 
    selectedDateFilter, 
    saveFilterState
  ]);
  
  // Filter events based on selected criteria
  const filteredEvents = useFilteredEvents({
    events,
    selectedCategories,
    allEventTypes,
    selectedVenues,
    dateRange,
    selectedDateFilter
  });

  // Get similar events if no results match our filters but filters are active
  const { similarEvents = [] } = useSimilarEventsHandler({
    mainEvents: filteredEvents,
    hasActiveFilters,
    selectedEventTypes: selectedCategories,
    dateRange,
    selectedDateFilter,
    userId: user?.id
  });
  
  // RSVP handling
  const { 
    handleRsvp: enhancedHandleRsvp, 
    loadingEventId
  } = useEnhancedRsvp(user?.id);

  return children({
    events,
    filteredEvents,
    similarEvents,
    eventsLoading,
    isVenuesLoading,
    isFilterLoading,
    allEventTypes,
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected,
    hasActiveFilters,
    showAdvancedFilters,
    toggleAdvancedFilters,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    venues,
    selectedVenues,
    setSelectedVenues,
    locations,
    hasAdvancedFilters,
    handleRemoveVenue,
    handleClearDateFilter,
    resetFilters,
    handleRsvp: user ? enhancedHandleRsvp : undefined,
    showRsvpButtons: !!user,
    loadingEventId
  });
};
