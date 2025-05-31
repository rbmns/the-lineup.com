import { useEffect, useCallback } from 'react';
import { useFilterState } from '@/contexts/FilterStateContext';
import { DateRange } from 'react-day-picker';

// Hook that connects the global filter state to the event filtering system
export const useGlobalFilterState = () => {
  const {
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
    selectedVenues,
    setSelectedVenues,
    selectedVibes,
    setSelectedVibes,
    hasAdvancedFilters,
    handleRemoveVenue,
    handleClearDateFilter,
    resetFilters,
    loadingEventId,
    setLoadingEventId
  } = useFilterState();

  // Memoized getters
  const selectedEventTypes = selectedCategories;
  
  // Save state with current URL and scroll position
  const handleSaveFilterState = useCallback(() => {
    // Implementation can be added later if needed
  }, []);

  // Wrapper for setting event types that also saves state
  const setSelectedEventTypes = useCallback((types: string[]) => {
    // Use toggleCategory for each type to update selectedCategories
    // This is a simplified implementation
    types.forEach(type => toggleCategory(type));
    handleSaveFilterState();
  }, [toggleCategory, handleSaveFilterState]);

  // Wrapper for setting venues that also saves state
  const setSelectedVenues = useCallback((venues: string[]) => {
    setSelectedVenues(venues);
    handleSaveFilterState();
  }, [setSelectedVenues, handleSaveFilterState]);

  // Wrapper for setting vibes that also saves state
  const setSelectedVibes = useCallback((vibes: string[]) => {
    setSelectedVibes(vibes);
    handleSaveFilterState();
  }, [setSelectedVibes, handleSaveFilterState]);

  // Wrapper for setting date range that also saves state
  const setSelectedDateRange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
    handleSaveFilterState();
  }, [setDateRange, handleSaveFilterState]);

  // Wrapper for setting date filter that also saves state
  const setSelectedDateFilter = useCallback((filter: string) => {
    setSelectedDateFilter(filter);
    handleSaveFilterState();
  }, [setSelectedDateFilter, handleSaveFilterState]);

  // Enhanced reset that clears all filters and updates UI
  const resetFiltersEnhanced = useCallback(() => {
    resetFilters();
    
    // Dispatch event for components that need to react to filter reset
    const resetEvent = new CustomEvent('filtersReset', {
      detail: { timestamp: Date.now() }
    });
    document.dispatchEvent(resetEvent);
  }, [resetFilters]);

  // Helper functions for individual filter types
  const handleRemoveEventType = useCallback((type: string) => {
    toggleCategory(type);
  }, [toggleCategory]);

  const handleRemoveVibe = useCallback((vibe: string) => {
    const newVibes = selectedVibes.filter(v => v !== vibe);
    setSelectedVibes(newVibes);
  }, [selectedVibes, setSelectedVibes]);

  // Load filters when entering events page
  useEffect(() => {
    if (window.location.pathname.includes('/events')) {
      // Only restore if not already initialized to prevent double-loading
      
      // Add event listener for page visibility changes
      // This helps restore state when returning to the tab
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && 
            window.location.pathname.includes('/events')) {
          console.log('Page became visible, checking filter state');
          // Use a small delay to ensure all page state is ready
          setTimeout(() => {
            // restoreFilterState();
          }, 100);
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

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
    selectedVibes,
    setSelectedVibes,
    dateRange,
    setDateRange: setSelectedDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    saveFilterState: handleSaveFilterState,
    restoreFilterState: () => {}, // Placeholder
    resetFilters: resetFiltersEnhanced,
    handleRemoveEventType,
    handleRemoveVenue,
    handleRemoveVibe,
    handleClearDateFilter,
    hasActiveFilters,
    hasAdvancedFilters,
    isFilterLoading: false,
  };
};
