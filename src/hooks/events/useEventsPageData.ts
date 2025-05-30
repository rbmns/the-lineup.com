
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
import { useEventVibes } from '@/hooks/useEventVibes';
import { supabase } from '@/lib/supabase';
import { useCategoryFilterSelection } from '@/hooks/events/useCategoryFilterSelection';
import { useEventFilterState } from '@/hooks/events/useEventFilterState';
import { useFilteredEvents } from '@/hooks/events/useFilteredEvents';

export const useEventsPageData = () => {
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  const { data: vibes = [], isLoading: vibesLoading } = useEventVibes();
  const [venues, setVenues] = useState<Array<{ value: string, label: string }>>([]);
  const [locations, setLocations] = useState<Array<{ value: string, label: string }>>([]);
  const [isVenuesLoading, setIsVenuesLoading] = useState(true);
  
  // Get all unique event types from events
  const allEventTypes = useMemo(() => {
    const types = events.map(event => event.event_category).filter(Boolean);
    return [...new Set(types)];
  }, [events]);
  
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
  } = useCategoryFilterSelection(allEventTypes, selectedEventTypes);
  
  // Keep the category filter and event type filter in sync with a debounce
  // to prevent infinite loops
  const syncFilters = useCallback(() => {
    // Only sync if the arrays are actually different to prevent loops
    if (
      selectedCategories.length !== selectedEventTypes.length ||
      selectedCategories.some(category => !selectedEventTypes.includes(category))
    ) {
      setSelectedEventTypes(selectedCategories);
    }
  }, [selectedCategories, selectedEventTypes, setSelectedEventTypes]);
  
  // Use effect with debounce to prevent rapid re-renders
  useEffect(() => {
    // Sync with a small delay to avoid render loops
    const timer = setTimeout(() => {
      syncFilters();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [selectedCategories, syncFilters]);
  
  // Initialize with all event types selected when they become available
  useEffect(() => {
    if (selectedCategories.length === 0 && allEventTypes.length > 0) {
      selectAll();
    }
  }, [allEventTypes, selectedCategories.length, selectAll]);
  
  // Fetch all venues for the filter
  useEffect(() => {
    const fetchVenues = async () => {
      setIsVenuesLoading(true);
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          const venueOptions = data.map(venue => ({
            value: venue.id,
            label: venue.name
          }));
          setVenues(venueOptions);
        }
        
        // Create sample locations for the design
        setLocations([
          { value: 'zandvoort-area', label: 'Zandvoort Area' }
        ]);
      } catch (err) {
        console.error('Error fetching venues:', err);
      } finally {
        setIsVenuesLoading(false);
      }
    };

    fetchVenues();
  }, []);
  
  // Use the filtered events hook
  const filteredEvents = useFilteredEvents({
    events,
    selectedCategories,
    allEventTypes,
    selectedVenues,
    dateRange,
    selectedDateFilter
  });

  const { 
    handleRsvp: enhancedHandleRsvp, 
    loadingEventId
  } = useEnhancedRsvp(user?.id);
  
  return {
    user,
    events,
    eventsLoading,
    filteredEvents,
    venues,
    locations,
    isVenuesLoading,
    allEventTypes,
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected,
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
    handleClearDateFilter,
    enhancedHandleRsvp,
    loadingEventId,
    vibes,
    vibesLoading
  };
};
