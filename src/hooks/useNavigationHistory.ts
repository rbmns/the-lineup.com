
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Type definition for filter state
interface FilterState {
  eventTypes: string[];
  venues: string[];
  dateRange: any;
  dateFilter: string;
}

export const useNavigationHistory = () => {
  const location = useLocation();

  // Save filter state to session storage
  const saveFilterState = useCallback((filterState: Partial<FilterState>) => {
    try {
      // Store the current filter state
      sessionStorage.setItem('event-filter-state', JSON.stringify({
        ...filterState,
        path: location.pathname,
        search: location.search,
        timestamp: Date.now()
      }));
      
      console.log('Filter state saved in navigation history:', filterState);
    } catch (error) {
      console.error('Error saving filter state:', error);
    }
  }, [location.pathname, location.search]);

  // Load filter state from session storage
  const loadFilterState = useCallback(() => {
    try {
      const storedState = sessionStorage.getItem('event-filter-state');
      if (storedState) {
        return JSON.parse(storedState);
      }
    } catch (error) {
      console.error('Error loading filter state:', error);
    }
    return null;
  }, []);

  // Clear filter state from session storage
  const clearFilterState = useCallback(() => {
    try {
      sessionStorage.removeItem('event-filter-state');
    } catch (error) {
      console.error('Error clearing filter state:', error);
    }
  }, []);

  return {
    saveFilterState,
    loadFilterState,
    clearFilterState
  };
};
