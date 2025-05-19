
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Define a proper type for navigation history entries
interface NavigationHistoryEntry {
  pathname: string;
  search: string;
  timestamp: number;
  filterState?: {
    eventTypes?: string[];
    venues?: string[];
    dateRange?: any;
    dateFilter?: string;
  };
}

interface NavigationHistoryResult {
  getPreviousPath: () => {
    path: string;
    search: string;
    fullPath: string;
    filterState?: NavigationHistoryEntry['filterState'];
  };
  hasFilteredEventsHistory: () => boolean;
  getFilteredEventsPath: () => string;
  getFullHistory: () => NavigationHistoryEntry[];
  isInitialized: boolean;
  saveFilterState: (filterState: NavigationHistoryEntry['filterState']) => void;
  getLastFilterState: () => NavigationHistoryEntry['filterState'] | undefined;
}

// Storage key for persisting navigation history
const NAVIGATION_HISTORY_STORAGE_KEY = 'events-navigation-history';

export const useNavigationHistory = (maxEntries = 10): NavigationHistoryResult => {
  const location = useLocation();
  const history = useRef<NavigationHistoryEntry[]>([]);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize history from sessionStorage on mount
  useEffect(() => {
    try {
      const storedHistory = sessionStorage.getItem(NAVIGATION_HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed)) {
          history.current = parsed;
        }
      }
    } catch (e) {
      console.error("Error loading navigation history:", e);
    }
    
    if (!initialized) {
      setInitialized(true);
    }
  }, []);
  
  // Track navigation history
  useEffect(() => {
    // Don't track the same URL twice in a row
    if (history.current.length > 0) {
      const lastEntry = history.current[history.current.length - 1];
      if (lastEntry.pathname === location.pathname && lastEntry.search === location.search) {
        return;
      }
    }

    // Add current location to history
    const newEntry: NavigationHistoryEntry = {
      pathname: location.pathname,
      search: location.search,
      timestamp: Date.now()
    };
    
    // Preserve filter state when navigating away from /events
    if (history.current.length > 0) {
      const lastEntry = history.current[history.current.length - 1];
      if (lastEntry.pathname === '/events' && lastEntry.filterState) {
        // Save filter state in sessionStorage specifically for /events
        sessionStorage.setItem('events-filter-state', JSON.stringify(lastEntry.filterState));
      }
    }
    
    history.current.push(newEntry);
    
    // Limit history size
    if (history.current.length > maxEntries) {
      history.current.shift();
    }

    // Save history to sessionStorage
    try {
      sessionStorage.setItem(NAVIGATION_HISTORY_STORAGE_KEY, JSON.stringify(history.current));
    } catch (e) {
      console.error("Error saving navigation history:", e);
    }

    if (!initialized) {
      setInitialized(true);
    }
    
    // Debug log
    console.log('Navigation history updated:', location.pathname, location.search);
  }, [location, maxEntries, initialized]);

  const getPreviousPath = () => {
    // If we have at least 2 entries, return the second last
    if (history.current.length >= 2) {
      const entry = history.current[history.current.length - 2];
      return {
        path: entry.pathname,
        search: entry.search,
        fullPath: `${entry.pathname}${entry.search}`,
        filterState: entry.filterState
      };
    }
    
    // Default to events page if no history
    return {
      path: '/events',
      search: '',
      fullPath: '/events',
      filterState: undefined
    };
  };

  const hasFilteredEventsHistory = () => {
    // Check if we've navigated from /events with search parameters
    return history.current.some(entry => 
      entry.pathname === '/events' && (entry.search && entry.search.length > 0 || entry.filterState));
  };

  const getFilteredEventsPath = () => {
    // Find the most recent /events path with search parameters
    const eventsWithFilters = [...history.current]
      .reverse()
      .find(entry => entry.pathname === '/events' && (entry.search || entry.filterState));
      
    if (eventsWithFilters) {
      return `${eventsWithFilters.pathname}${eventsWithFilters.search}`;
    }
    
    return '/events';
  };

  // Save filter state to the current history entry
  const saveFilterState = (filterState: NavigationHistoryEntry['filterState']) => {
    if (history.current.length > 0 && location.pathname === '/events') {
      const currentEntry = history.current[history.current.length - 1];
      currentEntry.filterState = filterState;
      
      // Save to sessionStorage
      try {
        sessionStorage.setItem('events-filter-state', JSON.stringify(filterState));
        sessionStorage.setItem(NAVIGATION_HISTORY_STORAGE_KEY, JSON.stringify(history.current));
      } catch (e) {
        console.error("Error saving filter state:", e);
      }
      
      console.log("Filter state saved:", filterState);
    }
  };
  
  // Get the last saved filter state
  const getLastFilterState = () => {
    // First try to get from history
    const eventsEntry = [...history.current]
      .reverse()
      .find(entry => entry.pathname === '/events' && entry.filterState);
      
    if (eventsEntry?.filterState) {
      return eventsEntry.filterState;
    }
    
    // Fallback to sessionStorage
    try {
      const storedState = sessionStorage.getItem('events-filter-state');
      if (storedState) {
        return JSON.parse(storedState);
      }
    } catch (e) {
      console.error("Error reading filter state:", e);
    }
    
    return undefined;
  };

  // Get complete navigation history (useful for debugging)
  const getFullHistory = () => [...history.current];

  return {
    getPreviousPath,
    hasFilteredEventsHistory,
    getFilteredEventsPath,
    getFullHistory,
    isInitialized: initialized,
    saveFilterState,
    getLastFilterState
  };
};
