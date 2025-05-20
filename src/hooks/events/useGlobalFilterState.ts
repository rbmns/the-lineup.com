
import { useEffect, useCallback } from 'react';
import { useFilterStateContext } from '@/contexts/FilterStateContext';
import { DateRange } from 'react-day-picker';

// Hook that connects the global filter state to the event filtering system
export const useGlobalFilterState = () => {
  const {
    filterState,
    setEventTypes,
    setVenues,
    setDateRange,
    setDateFilter,
    saveFilterState,
    restoreFilterState,
    resetFilters: contextResetFilters,
    isRestoringFilters,
    isInitialized
  } = useFilterStateContext();

  // Memoized getters
  const selectedEventTypes = filterState.eventTypes;
  const selectedVenues = filterState.venues;
  const dateRange = filterState.dateRange;
  const selectedDateFilter = filterState.dateFilter;
  
  // Save state with current URL and scroll position
  const handleSaveFilterState = useCallback(() => {
    saveFilterState({
      urlParams: window.location.search,
      scrollPosition: window.scrollY
    });
  }, [saveFilterState]);

  // Wrapper for setting event types that also saves state
  const setSelectedEventTypes = useCallback((types: string[]) => {
    setEventTypes(types);
    handleSaveFilterState();
  }, [setEventTypes, handleSaveFilterState]);

  // Wrapper for setting venues that also saves state
  const setSelectedVenues = useCallback((venues: string[]) => {
    setVenues(venues);
    handleSaveFilterState();
  }, [setVenues, handleSaveFilterState]);

  // Wrapper for setting date range that also saves state
  const setSelectedDateRange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
    handleSaveFilterState();
  }, [setDateRange, handleSaveFilterState]);

  // Wrapper for setting date filter that also saves state
  const setSelectedDateFilter = useCallback((filter: string) => {
    setDateFilter(filter);
    handleSaveFilterState();
  }, [setDateFilter, handleSaveFilterState]);

  // Enhanced reset that clears all filters and updates UI
  const resetFilters = useCallback(() => {
    contextResetFilters();
    
    // Dispatch event for components that need to react to filter reset
    const resetEvent = new CustomEvent('filtersReset', {
      detail: { timestamp: Date.now() }
    });
    document.dispatchEvent(resetEvent);
  }, [contextResetFilters]);

  // Helper functions for individual filter types
  const handleRemoveEventType = useCallback((type: string) => {
    setSelectedEventTypes(selectedEventTypes.filter(t => t !== type));
  }, [selectedEventTypes, setSelectedEventTypes]);

  const handleRemoveVenue = useCallback((venue: string) => {
    setSelectedVenues(selectedVenues.filter(v => v !== venue));
  }, [selectedVenues, setSelectedVenues]);

  const handleClearDateFilter = useCallback(() => {
    setSelectedDateRange(undefined);
    setSelectedDateFilter('');
  }, [setSelectedDateRange, setSelectedDateFilter]);

  // Calculate derived state
  const hasActiveFilters = 
    selectedEventTypes.length > 0 ||
    selectedVenues.length > 0 ||
    dateRange !== undefined ||
    selectedDateFilter !== '';

  const hasAdvancedFilters =
    selectedVenues.length > 0 ||
    dateRange !== undefined ||
    selectedDateFilter !== '';

  // Load filters when entering events page
  useEffect(() => {
    if (window.location.pathname.includes('/events')) {
      // Only restore if not already initialized to prevent double-loading
      if (!isInitialized) {
        restoreFilterState();
      }
      
      // Add event listener for page visibility changes
      // This helps restore state when returning to the tab
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && 
            window.location.pathname.includes('/events')) {
          console.log('Page became visible, checking filter state');
          // Use a small delay to ensure all page state is ready
          setTimeout(() => {
            restoreFilterState();
          }, 100);
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isInitialized, restoreFilterState]);

  // Enhanced listener for RSVP operations
  useEffect(() => {
    const handleRsvpStart = () => {
      // Capture current filter state when RSVP starts
      if (window.location.pathname.includes('/events')) {
        console.log('RSVP operation detected, preserving filter state');
        handleSaveFilterState();
      }
    };
    
    // Add attribute observer to detect RSVP operations
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'data-rsvp-in-progress') {
          const inProgress = document.body.hasAttribute('data-rsvp-in-progress');
          if (inProgress) {
            handleRsvpStart();
          }
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    // Also listen for explicit RSVP events
    document.addEventListener('rsvpStarted', handleRsvpStart);
    
    return () => {
      observer.disconnect();
      document.removeEventListener('rsvpStarted', handleRsvpStart);
    };
  }, [handleSaveFilterState]);

  return {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange: setSelectedDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    saveFilterState: handleSaveFilterState,
    restoreFilterState,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
    hasActiveFilters,
    hasAdvancedFilters,
    isFilterLoading: isRestoringFilters,
  };
};
