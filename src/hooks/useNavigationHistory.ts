
import { useCallback, useRef } from 'react';
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
  const lastSavedState = useRef<string>('');

  // Save filter state to session storage
  const saveFilterState = useCallback((filterState: Partial<FilterState>) => {
    try {
      // Create the complete state object
      const completeState = {
        ...filterState,
        path: location.pathname,
        search: location.search,
        timestamp: Date.now()
      };
      
      // Only save if the state has actually changed
      const stateString = JSON.stringify(completeState);
      if (stateString !== lastSavedState.current) {
        sessionStorage.setItem('event-filter-state', stateString);
        lastSavedState.current = stateString;
        console.log('Filter state saved in navigation history:', filterState);
      }
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
      lastSavedState.current = '';
    } catch (error) {
      console.error('Error clearing filter state:', error);
    }
  }, []);

  // Get the previous path and associated data
  const getPreviousPath = useCallback(() => {
    try {
      const filterState = loadFilterState();
      return {
        path: filterState?.path || '/events',
        fullPath: `${filterState?.path || '/events'}${filterState?.search || ''}`,
        filterState: filterState || {},
        timestamp: filterState?.timestamp || 0
      };
    } catch (error) {
      console.error('Error getting previous path:', error);
      return {
        path: '/events',
        fullPath: '/events',
        filterState: {},
        timestamp: 0
      };
    }
  }, [loadFilterState]);

  // Check if we have history of filtered events
  const hasFilteredEventsHistory = useCallback(() => {
    try {
      const filterState = loadFilterState();
      return !!(filterState && 
        filterState.path === '/events' && 
        (filterState.eventTypes?.length > 0 || 
         filterState.venues?.length > 0 || 
         filterState.dateFilter || 
         filterState.dateRange?.from));
    } catch (error) {
      console.error('Error checking filtered events history:', error);
      return false;
    }
  }, [loadFilterState]);

  // Get the filtered events path with preserved search parameters
  const getFilteredEventsPath = useCallback(() => {
    try {
      const filterState = loadFilterState();
      return filterState && filterState.search ? 
        `/events${filterState.search}` : 
        '/events';
    } catch (error) {
      console.error('Error getting filtered events path:', error);
      return '/events';
    }
  }, [loadFilterState]);

  // Get the last saved filter state
  const getLastFilterState = useCallback(() => {
    try {
      const filterState = loadFilterState();
      return filterState || {};
    } catch (error) {
      console.error('Error getting last filter state:', error);
      return {};
    }
  }, [loadFilterState]);

  return {
    saveFilterState,
    loadFilterState,
    clearFilterState,
    getPreviousPath,
    hasFilteredEventsHistory,
    getFilteredEventsPath,
    getLastFilterState
  };
};
