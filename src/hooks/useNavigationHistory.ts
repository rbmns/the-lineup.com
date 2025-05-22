
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Keys for storing filter state
const FILTER_STATE_KEY = 'navigation_filter_state';
const LAST_URL_KEY = 'last_url_path';
const FILTERED_EVENTS_KEY = 'filtered_events_path';

export const useNavigationHistory = () => {
  const location = useLocation();
  
  /**
   * Saves the current filter state to be restored later
   */
  const saveFilterState = useCallback((filterState: any) => {
    try {
      // Store the current URL path and filter state
      sessionStorage.setItem(LAST_URL_KEY, location.pathname + location.search);
      sessionStorage.setItem(FILTER_STATE_KEY, JSON.stringify({
        ...filterState,
        timestamp: Date.now(),
        path: location.pathname,
        search: location.search
      }));
      
      // If we're on the events page, store this as a filtered events path
      if (location.pathname === '/events' && location.search) {
        sessionStorage.setItem(FILTERED_EVENTS_KEY, JSON.stringify({
          path: location.pathname,
          search: location.search,
          timestamp: Date.now(),
          filterState
        }));
      }
      
      console.log('Navigation filter state saved:', filterState);
    } catch (e) {
      console.error('Failed to save navigation state:', e);
    }
  }, [location.pathname, location.search]);
  
  /**
   * Gets the saved filter state if available
   */
  const getSavedFilterState = useCallback(() => {
    try {
      const stored = sessionStorage.getItem(FILTER_STATE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to retrieve saved filter state:', e);
    }
    return null;
  }, []);
  
  /**
   * Checks if we're coming back from a detail page where we should restore state
   */
  const shouldRestoreFilters = useCallback(() => {
    try {
      const lastPath = sessionStorage.getItem(LAST_URL_KEY);
      
      // We should restore filters if:
      // 1. We have a saved filter state
      // 2. We're on the events page now
      // 3. The last path was different (e.g., we came from a detail page)
      
      const haveSavedState = sessionStorage.getItem(FILTER_STATE_KEY) !== null;
      const onEventsPage = location.pathname === '/events';
      const comingFromDifferentPage = lastPath && !lastPath.startsWith('/events');
      
      return haveSavedState && onEventsPage && comingFromDifferentPage;
    } catch (e) {
      console.error('Error checking if filters should be restored:', e);
    }
    return false;
  }, [location.pathname]);
  
  /**
   * Clears the saved filter state
   */
  const clearFilterState = useCallback(() => {
    try {
      sessionStorage.removeItem(FILTER_STATE_KEY);
      sessionStorage.removeItem(LAST_URL_KEY);
    } catch (e) {
      console.error('Failed to clear filter state:', e);
    }
  }, []);

  /**
   * Checks if there's a history of filtered events
   */
  const hasFilteredEventsHistory = useCallback(() => {
    try {
      const storedPath = sessionStorage.getItem(FILTERED_EVENTS_KEY);
      return storedPath !== null;
    } catch (e) {
      console.error('Error checking filtered events history:', e);
    }
    return false;
  }, []);

  /**
   * Gets the path to the last filtered events view
   */
  const getFilteredEventsPath = useCallback(() => {
    try {
      const storedPath = sessionStorage.getItem(FILTERED_EVENTS_KEY);
      if (storedPath) {
        const data = JSON.parse(storedPath);
        return data.path + data.search;
      }
    } catch (e) {
      console.error('Error getting filtered events path:', e);
    }
    return '/events';
  }, []);

  /**
   * Gets the last saved filter state
   */
  const getLastFilterState = useCallback(() => {
    try {
      const storedPath = sessionStorage.getItem(FILTERED_EVENTS_KEY);
      if (storedPath) {
        const data = JSON.parse(storedPath);
        return data.filterState || {};
      }
    } catch (e) {
      console.error('Error getting last filter state:', e);
    }
    return {};
  }, []);

  /**
   * Gets the previous path information
   */
  const getPreviousPath = useCallback(() => {
    try {
      const lastPath = sessionStorage.getItem(LAST_URL_KEY);
      const filterState = getSavedFilterState();
      
      return {
        path: lastPath ? lastPath.split('?')[0] : '/events',
        fullPath: lastPath || '/events',
        filterState: filterState || {}
      };
    } catch (e) {
      console.error('Error getting previous path:', e);
      return {
        path: '/events',
        fullPath: '/events',
        filterState: {}
      };
    }
  }, [getSavedFilterState]);

  return {
    saveFilterState,
    getSavedFilterState,
    shouldRestoreFilters,
    clearFilterState,
    getPreviousPath,
    hasFilteredEventsHistory,
    getFilteredEventsPath,
    getLastFilterState
  };
};
