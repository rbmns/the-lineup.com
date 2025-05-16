
import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { toast } from '@/hooks/use-toast';
import { useEventFilterState } from './useEventFilterState';
import { useAvailableFilterOptions } from './useAvailableFilterOptions';
import { useEventFilteringEngine } from './useEventFilteringEngine';
import { useEventRsvpHandler } from './useEventRsvpHandler';
import { Event } from '@/types';

export const useCategoryFilteredEvents = (userId: string | undefined) => {
  const { data: events = [], isLoading: isLoadingEvents, error, refetch: refetchEvents } = useEvents(userId);

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
    setIsFilterLoading,
    hasActiveFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
  } = useEventFilterState();

  const { availableEventTypes, availableVenues } = useAvailableFilterOptions(events as Event[]);

  const { exactMatches, showNoExactMatchesMessage } = useEventFilteringEngine({
    events: events as Event[],
    selectedEventTypes,
    selectedVenues,
    dateRange,
    selectedDateFilter,
    hasActiveFilters,
    setIsFilterLoading,
  });

  const { loadingEventId, handleEventRsvp } = useEventRsvpHandler({
    userId,
    refetchEvents,
  });

  const [similarEvents, setSimilarEvents] = useState<Event[]>([]); // Kept here for now

  const selectAllEventTypes = () => {
    setSelectedEventTypes(availableEventTypes.map(et => et.value));
    toast({ title: "All categories selected" });
  };

  const deselectAllEventTypes = () => {
    setSelectedEventTypes([]);
    toast({ title: "All categories deselected" });
  };

  return {
    events, // Original full list of events
    isLoading: isLoadingEvents, // Loading state for initial events fetch
    error,
    refetch: refetchEvents,

    // Filter states and setters
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,

    isFilterLoading, // Loading state specific to filter application
    loadingEventId,

    // Available filter options
    availableEventTypes,
    availableVenues,

    // Filtered results and UI states
    showNoExactMatchesMessage,
    exactMatches,
    similarEvents, // Managed here
    hasActiveFilters,

    // Filter actions
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
    selectAllEventTypes, // Now part of this composed hook
    deselectAllEventTypes, // Now part of this composed hook

    // RSVP action
    handleEventRsvp,

    // Setter for similar events
    setSimilarEvents, // Managed here
  };
};
