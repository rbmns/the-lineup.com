
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationHistoryEntry {
  pathname: string;
  search: string;
  timestamp: number;
}

export const useNavigationHistory = (maxEntries = 10) => {
  const location = useLocation();
  const history = useRef<NavigationHistoryEntry[]>([]);
  const [initialized, setInitialized] = useState(false);
  
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
    history.current.push({
      pathname: location.pathname,
      search: location.search,
      timestamp: Date.now()
    });
    
    // Limit history size
    if (history.current.length > maxEntries) {
      history.current.shift();
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
      return {
        path: history.current[history.current.length - 2].pathname,
        search: history.current[history.current.length - 2].search,
        fullPath: `${history.current[history.current.length - 2].pathname}${history.current[history.current.length - 2].search}`
      };
    }
    
    // Default to events page if no history
    return {
      path: '/events',
      search: '',
      fullPath: '/events'
    };
  };

  const hasFilteredEventsHistory = () => {
    // Check if we've navigated from /events with search parameters
    return history.current.some(entry => 
      entry.pathname === '/events' && entry.search && entry.search.length > 0);
  };

  const getFilteredEventsPath = () => {
    // Find the most recent /events path with search parameters
    const eventsWithFilters = history.current
      .filter(entry => entry.pathname === '/events' && entry.search && entry.search.length > 0)
      .pop();
      
    if (eventsWithFilters) {
      return `${eventsWithFilters.pathname}${eventsWithFilters.search}`;
    }
    
    return '/events';
  };

  // Get complete navigation history (useful for debugging)
  const getFullHistory = () => [...history.current];

  return {
    getPreviousPath,
    hasFilteredEventsHistory,
    getFilteredEventsPath,
    getFullHistory,
    isInitialized: initialized
  };
};
