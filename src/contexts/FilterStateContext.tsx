
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { DateRange } from 'react-day-picker';

// Types for our filter state
interface FilterState {
  eventTypes: string[];
  venues: string[];
  vibes: string[];
  dateRange: DateRange | undefined;
  dateFilter: string;
  timestamp: number;
  urlParams?: string;
  scrollPosition?: number;
  eventId?: string;
  status?: string;
}

// Props for the context
interface FilterStateContextProps {
  // Current filter state
  filterState: FilterState;
  
  // Methods to update specific parts of the filter state
  setEventTypes: (eventTypes: string[]) => void;
  setVenues: (venues: string[]) => void;
  setVibes: (vibes: string[]) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
  setDateFilter: (dateFilter: string) => void;
  
  // Methods to save and restore complete filter state
  saveFilterState: (state?: Partial<FilterState>) => void;
  restoreFilterState: (source?: 'navigation' | 'rsvp' | 'url' | 'storage') => void;
  
  // Reset all filters
  resetFilters: () => void;
  
  // Flag to indicate if filters are being restored
  isRestoringFilters: boolean;
  
  // Flag to indicate if the filter state has been initialized
  isInitialized: boolean;
}

// Create the context
const FilterStateContext = createContext<FilterStateContextProps | undefined>(undefined);

// Storage keys
const FILTER_STATE_KEY = 'global-filter-state';
const VENUE_FILTERS_KEY = 'event-venue-filters';
const VIBE_FILTERS_KEY = 'event-vibe-filters';
const DATE_RANGE_KEY = 'event-date-range';
const DATE_FILTER_KEY = 'event-date-filter';
const EVENT_TYPES_KEY = 'event-selected-types';

// Default empty filter state
const defaultFilterState: FilterState = {
  eventTypes: [],
  venues: [],
  vibes: [],
  dateRange: undefined,
  dateFilter: '',
  timestamp: Date.now(),
};

export const FilterStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize filter state from storage or with default values
  const [filterState, setFilterState] = useState<FilterState>(() => {
    if (typeof window === 'undefined') return defaultFilterState;
    
    try {
      // Try to get state from sessionStorage
      const storedState = sessionStorage.getItem(FILTER_STATE_KEY);
      
      if (storedState) {
        const parsed = JSON.parse(storedState);
        
        // Convert date strings back to Date objects if they exist
        if (parsed.dateRange && parsed.dateRange.from) {
          parsed.dateRange.from = new Date(parsed.dateRange.from);
          
          if (parsed.dateRange.to) {
            parsed.dateRange.to = new Date(parsed.dateRange.to);
          }
        }
        
        console.log('Restored filter state from storage:', parsed);
        return parsed;
      }
    } catch (e) {
      console.error('Error reading filter state from storage:', e);
    }
    
    return defaultFilterState;
  });
  
  // Track if filters are currently being restored
  const [isRestoringFilters, setIsRestoringFilters] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Methods to update specific parts of the filter state
  const setEventTypes = useCallback((eventTypes: string[]) => {
    setFilterState(prev => ({
      ...prev,
      eventTypes,
      timestamp: Date.now()
    }));
  }, []);
  
  const setVenues = useCallback((venues: string[]) => {
    setFilterState(prev => ({
      ...prev,
      venues,
      timestamp: Date.now()
    }));
  }, []);
  
  const setVibes = useCallback((vibes: string[]) => {
    setFilterState(prev => ({
      ...prev,
      vibes,
      timestamp: Date.now()
    }));
  }, []);
  
  const setDateRange = useCallback((dateRange: DateRange | undefined) => {
    setFilterState(prev => ({
      ...prev,
      dateRange,
      timestamp: Date.now()
    }));
  }, []);
  
  const setDateFilter = useCallback((dateFilter: string) => {
    setFilterState(prev => ({
      ...prev,
      dateFilter,
      timestamp: Date.now()
    }));
  }, []);
  
  // Method to save the current filter state
  const saveFilterState = useCallback((updates?: Partial<FilterState>) => {
    setFilterState(prev => {
      const newState = {
        ...prev,
        ...(updates || {}),
        timestamp: Date.now(),
        urlParams: window.location.search,
        scrollPosition: window.scrollY
      };
      
      try {
        // Prepare a version safe for JSON serialization
        const serializableState = JSON.parse(JSON.stringify(newState));
        
        // Save to sessionStorage
        sessionStorage.setItem(FILTER_STATE_KEY, JSON.stringify(serializableState));
        
        // Save individual components for backward compatibility
        sessionStorage.setItem(VENUE_FILTERS_KEY, JSON.stringify(newState.venues));
        sessionStorage.setItem(VIBE_FILTERS_KEY, JSON.stringify(newState.vibes));
        sessionStorage.setItem(EVENT_TYPES_KEY, JSON.stringify(newState.eventTypes));
        
        if (newState.dateFilter) {
          sessionStorage.setItem(DATE_FILTER_KEY, newState.dateFilter);
        }
        
        if (newState.dateRange) {
          const serializableRange = {
            from: newState.dateRange.from?.toISOString(),
            to: newState.dateRange.to?.toISOString()
          };
          sessionStorage.setItem(DATE_RANGE_KEY, JSON.stringify(serializableRange));
        }
        
        // Also store in window for RSVP operations
        if (typeof window !== 'undefined') {
          window._filterStateBeforeRsvp = {
            urlParams: window.location.search,
            scrollPosition: window.scrollY,
            timestamp: Date.now(),
            eventTypes: newState.eventTypes,
            vibes: newState.vibes,
            pathname: window.location.pathname
          };
        }
        
        console.log('Saved filter state:', newState);
      } catch (e) {
        console.error('Error saving filter state:', e);
      }
      
      return newState;
    });
  }, []);
  
  // Method to restore filter state from various sources
  const restoreFilterState = useCallback((source: 'navigation' | 'rsvp' | 'url' | 'storage' = 'storage') => {
    console.log(`Restoring filter state from source: ${source}`);
    setIsRestoringFilters(true);
    
    try {
      let newState: FilterState | null = null;
      
      // Priority 1: Restore from window._filterStateBeforeRsvp (RSVP operations)
      if (source === 'rsvp' && typeof window !== 'undefined' && window._filterStateBeforeRsvp) {
        const rsvpState = window._filterStateBeforeRsvp;
        newState = {
          eventTypes: rsvpState.eventTypes || [],
          venues: [],
          vibes: rsvpState.vibes || [],
          dateRange: undefined,
          dateFilter: '',
          timestamp: rsvpState.timestamp,
          urlParams: rsvpState.urlParams,
          scrollPosition: rsvpState.scrollPosition
        };
        
        // Get additional filter data from sessionStorage
        try {
          const venuesStr = sessionStorage.getItem(VENUE_FILTERS_KEY);
          if (venuesStr) {
            newState.venues = JSON.parse(venuesStr);
          }
          
          const vibesStr = sessionStorage.getItem(VIBE_FILTERS_KEY);
          if (vibesStr) {
            newState.vibes = JSON.parse(vibesStr);
          }
          
          const dateRangeStr = sessionStorage.getItem(DATE_RANGE_KEY);
          if (dateRangeStr) {
            const parsed = JSON.parse(dateRangeStr);
            if (parsed && parsed.from) {
              newState.dateRange = {
                from: new Date(parsed.from)
              } as DateRange;
              
              if (parsed.to) {
                newState.dateRange.to = new Date(parsed.to);
              }
            }
          }
          
          const dateFilter = sessionStorage.getItem(DATE_FILTER_KEY);
          if (dateFilter) {
            newState.dateFilter = dateFilter;
          }
        } catch (e) {
          console.error('Error parsing additional filter data:', e);
        }
      }
      // Priority 2: Restore from sessionStorage (general navigation)
      else if ((source === 'navigation' || source === 'storage') && typeof window !== 'undefined') {
        const storedState = sessionStorage.getItem(FILTER_STATE_KEY);
        if (storedState) {
          const parsed = JSON.parse(storedState);
          
          // Convert date strings back to Date objects
          if (parsed.dateRange && parsed.dateRange.from) {
            parsed.dateRange.from = new Date(parsed.dateRange.from);
            
            if (parsed.dateRange.to) {
              parsed.dateRange.to = new Date(parsed.dateRange.to);
            }
          }
          
          newState = parsed;
        }
      }
      // Priority 3: Restore from URL (direct navigation) with standardized parameter names
      else if (source === 'url' && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const eventTypes = urlParams.getAll('type');
        const vibes = urlParams.getAll('vibe');
        const dateFrom = urlParams.get('dateFrom');
        const dateTo = urlParams.get('dateTo');
        const dateFilter = urlParams.get('dateFilter');
        const venues = urlParams.getAll('venue');
        
        // Prepare date range if parameters exist
        let dateRange: DateRange | undefined;
        if (dateFrom) {
          dateRange = { from: new Date(dateFrom) } as DateRange;
          if (dateTo) {
            dateRange.to = new Date(dateTo);
          }
        }
        
        newState = {
          eventTypes: eventTypes || [],
          venues: venues || [],
          vibes: vibes || [],
          dateRange,
          dateFilter: dateFilter || '',
          timestamp: Date.now(),
          urlParams: window.location.search,
          scrollPosition: window.scrollY
        };
      }
      
      // Apply the new state if we found one
      if (newState) {
        setFilterState(newState);
        console.log('Successfully restored filter state:', newState);
        
        // If we have URL params, ensure URL is updated
        if (newState.urlParams && source === 'rsvp') {
          window.history.replaceState({}, '', `${window.location.pathname}${newState.urlParams}`);
        }
        
        // If we have a scroll position, restore it
        if (newState.scrollPosition && source === 'rsvp') {
          window.scrollTo({ top: newState.scrollPosition, behavior: 'auto' });
        }
        
        // Dispatch event to notify components about filter restoration
        const filterRestoredEvent = new CustomEvent('filtersRestored', {
          detail: {
            urlParams: newState.urlParams,
            eventTypes: newState.eventTypes,
            vibes: newState.vibes,
            timestamp: Date.now(),
            source: 'filter-context'
          }
        });
        document.dispatchEvent(filterRestoredEvent);
      } else {
        console.warn('No filter state found to restore');
      }
    } catch (e) {
      console.error('Error restoring filter state:', e);
    } finally {
      // Mark initialization as complete after first restore
      setIsInitialized(true);
      setIsRestoringFilters(false);
    }
  }, []);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    const emptyState = {
      ...defaultFilterState,
      timestamp: Date.now()
    };
    
    setFilterState(emptyState);
    
    // Clear storage
    try {
      sessionStorage.removeItem(FILTER_STATE_KEY);
      sessionStorage.removeItem(VENUE_FILTERS_KEY);
      sessionStorage.removeItem(VIBE_FILTERS_KEY);
      sessionStorage.removeItem(DATE_RANGE_KEY);
      sessionStorage.removeItem(DATE_FILTER_KEY);
      sessionStorage.removeItem(EVENT_TYPES_KEY);
      
      // Clear URL parameters related to filters
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete('type');
      urlParams.delete('vibe');
      urlParams.delete('venue');
      urlParams.delete('dateFrom');
      urlParams.delete('dateTo');
      urlParams.delete('dateFilter');
      
      const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    } catch (e) {
      console.error('Error clearing filter state:', e);
    }
    
    console.log('All filters reset');
  }, []);
  
  // Initialize from URL if present, otherwise from storage
  useEffect(() => {
    if (!isInitialized) {
      const urlParams = new URLSearchParams(window.location.search);
      // Check if we have any filter parameters in URL
      if (urlParams.has('type') || 
          urlParams.has('vibe') ||
          urlParams.has('venue') || 
          urlParams.has('dateFrom') || 
          urlParams.has('dateFilter')) {
        restoreFilterState('url');
      } else {
        restoreFilterState('storage');
      }
    }
  }, [isInitialized, restoreFilterState]);
  
  // Listen for filter restoration events
  useEffect(() => {
    const handleFilterRestoration = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Filter restoration event received in context:', customEvent.detail);
      
      if (customEvent.detail?.source !== 'filter-context') {
        // Don't react to our own events
        const source = customEvent.detail?.source === 'rsvp-state-manager' ? 'rsvp' : 'navigation';
        restoreFilterState(source);
      }
    };
    
    document.addEventListener('filtersRestored', handleFilterRestoration);
    
    return () => {
      document.removeEventListener('filtersRestored', handleFilterRestoration);
    };
  }, [restoreFilterState]);
  
  // Update URL whenever filter state changes (except during restoration)
  useEffect(() => {
    if (isInitialized && !isRestoringFilters && typeof window !== 'undefined') {
      if (window.location.pathname.includes('/events')) {
        try {
          const urlParams = new URLSearchParams();
          
          // Add event types with standardized name 'type'
          filterState.eventTypes.forEach(type => {
            urlParams.append('type', type);
          });
          
          // Add vibes with standardized name 'vibe'
          filterState.vibes.forEach(vibe => {
            urlParams.append('vibe', vibe);
          });
          
          // Add venues with standardized name 'venue'
          if (filterState.venues.length > 0) {
            filterState.venues.forEach(venue => {
              urlParams.append('venue', venue);
            });
          }
          
          // Add date range with standardized names
          if (filterState.dateRange?.from) {
            urlParams.set('dateFrom', filterState.dateRange.from.toISOString());
            
            if (filterState.dateRange.to) {
              urlParams.set('dateTo', filterState.dateRange.to.toISOString());
            }
          }
          
          // Add date filter
          if (filterState.dateFilter) {
            urlParams.set('dateFilter', filterState.dateFilter);
          }
          
          // Only update if not during RSVP operation
          if (!window.rsvpInProgress) {
            const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
            window.history.replaceState({}, '', newUrl);
          }
        } catch (e) {
          console.error('Error updating URL with filter state:', e);
        }
      }
    }
  }, [filterState, isInitialized, isRestoringFilters]);
  
  const value = {
    filterState,
    setEventTypes,
    setVenues,
    setVibes,
    setDateRange,
    setDateFilter,
    saveFilterState,
    restoreFilterState,
    resetFilters,
    isRestoringFilters,
    isInitialized
  };
  
  return (
    <FilterStateContext.Provider value={value}>
      {children}
    </FilterStateContext.Provider>
  );
};

// Hook to use the filter state context
export const useFilterStateContext = () => {
  const context = useContext(FilterStateContext);
  if (!context) {
    throw new Error('useFilterStateContext must be used within a FilterStateProvider');
  }
  return context;
};
