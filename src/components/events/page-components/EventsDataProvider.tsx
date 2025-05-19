import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useVenueData } from '@/hooks/events/useVenueData';
import { useEventTypeData } from '@/hooks/events/useEventTypeData';
import { useCategoryFilterSelection } from '@/hooks/events/useCategoryFilterSelection';
import { useEventFilterState } from '@/hooks/events/useEventFilterState';
import { useFilteredEvents } from '@/hooks/events/useFilteredEvents';
import { useSimilarEventsHandler } from '@/hooks/events/useSimilarEventsHandler';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
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
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  
  // Get venue data
  const { venues, locations, isVenuesLoading } = useVenueData();
  
  // Get event type data
  const { allEventTypes } = useEventTypeData(events);
  
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
