import { useState, useEffect, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { useLocation } from 'react-router-dom';

// Storage keys
const VENUE_FILTERS_KEY = 'event-venue-filters';
const DATE_RANGE_KEY = 'event-date-range';
const DATE_FILTER_KEY = 'event-date-filter';
const EVENT_TYPES_KEY = 'event-selected-types';
const ADVANCED_FILTERS_KEY = 'event-advanced-filters';
const FILTER_STATE_SNAPSHOT_KEY = 'event-filter-state-snapshot';

export const useEventFilterState = () => {
  const location = useLocation();
  
  // Initialize filter states from storage or navigation state
  const getInitialVenues = () => {
    try {
      // Check location state first if coming from event detail
      if (location.state?.fromEventDetail && 
          location.state?.restoreFilters && 
          location.state?.filterState?.venues) {
        const stateVenues = location.state.filterState.venues;
        if (Array.isArray(stateVenues)) {
          console.log("Restored venues from navigation state:", stateVenues);
          return stateVenues;
        }
      }
      
      // Then check sessionStorage
      const stored = sessionStorage.getItem(VENUE_FILTERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      
      // Check URL parameters
      const urlParams = new URLSearchParams(location.search);
      const venuesParam = urlParams.get('venues');
      if (venuesParam) {
        try {
          const parsedVenues = JSON.parse(decodeURIComponent(venuesParam));
          if (Array.isArray(parsedVenues)) {
            return parsedVenues;
          }
        } catch (e) {
          console.error("Error parsing URL venues:", e);
        }
      }
      
      // Check filter state snapshot
      try {
        const snapshot = sessionStorage.getItem(FILTER_STATE_SNAPSHOT_KEY);
        if (snapshot) {
          const parsed = JSON.parse(snapshot);
          if (parsed && Array.isArray(parsed.venues)) {
            return parsed.venues;
          }
        }
      } catch (e) {
        console.error("Error reading filter state snapshot:", e);
      }
    } catch (e) {
      console.error("Error reading stored venues:", e);
    }
    return [];
  };
  
  const getInitialDateRange = () => {
    try {
      // Check location state first if coming from event detail
      if (location.state?.fromEventDetail && 
          location.state?.restoreFilters && 
          location.state?.filterState?.dateRange) {
        const stateDateRange = location.state.filterState.dateRange;
        if (stateDateRange && (stateDateRange.from || stateDateRange.to)) {
          // Ensure dates are proper Date objects
          if (stateDateRange.from) {
            stateDateRange.from = new Date(stateDateRange.from);
          }
          if (stateDateRange.to) {
            stateDateRange.to = new Date(stateDateRange.to);
          }
          console.log("Restored date range from navigation state:", stateDateRange);
          // Only return if it has a from property
          if (stateDateRange.from) {
            return stateDateRange as DateRange;
          }
        }
      }
      
      // Then check sessionStorage
      const stored = sessionStorage.getItem(DATE_RANGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.from) {
          // Convert date strings back to Date objects
          const range = {
            from: new Date(parsed.from)
          } as DateRange;
          
          if (parsed.to) {
            range.to = new Date(parsed.to);
          }
          return range;
        }
      }
      
      // Check URL parameters
      const urlParams = new URLSearchParams(location.search);
      const fromParam = urlParams.get('dateFrom');
      const toParam = urlParams.get('dateTo');
      if (fromParam) {
        const range = {
          from: new Date(fromParam)
        } as DateRange;
        
        if (toParam) {
          range.to = new Date(toParam);
        }
        return range;
      }
      
      // Check filter state snapshot
      try {
        const snapshot = sessionStorage.getItem(FILTER_STATE_SNAPSHOT_KEY);
        if (snapshot) {
          const parsed = JSON.parse(snapshot);
          if (parsed && parsed.dateRange && parsed.dateRange.from) {
            const range = {
              from: new Date(parsed.dateRange.from)
            } as DateRange;
            
            if (parsed.dateRange.to) {
              range.to = new Date(parsed.dateRange.to);
            }
            return range;
          }
        }
      } catch (e) {
        console.error("Error reading filter state snapshot:", e);
      }
    } catch (e) {
      console.error("Error reading stored date range:", e);
    }
    return undefined;
  };
  
  const getInitialDateFilter = () => {
    try {
      // Check location state first if coming from event detail
      if (location.state?.fromEventDetail && 
          location.state?.restoreFilters && 
          location.state?.filterState?.dateFilter) {
        const stateDateFilter = location.state.filterState.dateFilter;
        if (typeof stateDateFilter === 'string') {
          console.log("Restored date filter from navigation state:", stateDateFilter);
          return stateDateFilter;
        }
      }
      
      // Then check sessionStorage
      const stored = sessionStorage.getItem(DATE_FILTER_KEY);
      if (stored) {
        return stored;
      }
      
      // Check URL parameters
      const urlParams = new URLSearchParams(location.search);
      const dateFilterParam = urlParams.get('dateFilter');
      if (dateFilterParam) {
        return dateFilterParam;
      }
      
      // Check filter state snapshot
      try {
        const snapshot = sessionStorage.getItem(FILTER_STATE_SNAPSHOT_KEY);
        if (snapshot) {
          const parsed = JSON.parse(snapshot);
          if (parsed && parsed.dateFilter) {
            return parsed.dateFilter;
          }
        }
      } catch (e) {
        console.error("Error reading filter state snapshot:", e);
      }
    } catch (e) {
      console.error("Error reading stored date filter:", e);
    }
    return '';
  };
  
  const getInitialEventTypes = () => {
    try {
      // Check URL parameters first for event types with standardized name 'type'
      const urlParams = new URLSearchParams(location.search);
      const eventTypes = urlParams.getAll('type');
      if (eventTypes && eventTypes.length > 0) {
        return eventTypes;
      }
      
      // Check location state if coming from event detail
      if (location.state?.fromEventDetail && 
          location.state?.restoreFilters && 
          location.state?.filterState?.eventTypes) {
        const stateEventTypes = location.state.filterState.eventTypes;
        if (Array.isArray(stateEventTypes) && stateEventTypes.length > 0) {
          console.log("Restored event types from navigation state:", stateEventTypes);
          return stateEventTypes;
        }
      }
      
      // Check sessionStorage
      const stored = sessionStorage.getItem(EVENT_TYPES_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {
          console.error("Error parsing stored event types:", e);
        }
      }
      
      // Check filter state snapshot
      try {
        const snapshot = sessionStorage.getItem(FILTER_STATE_SNAPSHOT_KEY);
        if (snapshot) {
          const parsed = JSON.parse(snapshot);
          if (parsed && Array.isArray(parsed.eventTypes)) {
            return parsed.eventTypes;
          }
        }
      } catch (e) {
        console.error("Error reading filter state snapshot:", e);
      }
      
      // Try to get from restored filter state if available
      if (window._lastRestoredFilterState?.eventTypes) {
        return window._lastRestoredFilterState.eventTypes;
      }
    } catch (e) {
      console.error("Error reading stored event types:", e);
    }
    
    return [];
  };
  
  const getInitialAdvancedFilterState = () => {
    try {
      const stored = sessionStorage.getItem(ADVANCED_FILTERS_KEY);
      if (stored) {
        return stored === 'true';
      }
    } catch (e) {
      console.error("Error reading advanced filters state:", e);
    }
    return false;
  };
  
  // Initialize state with empty arrays instead of specific event types
  // This allows the parent component to populate with all event types if needed
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(getInitialEventTypes);
  const [selectedVenues, setSelectedVenues] = useState<string[]>(getInitialVenues);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getInitialDateRange);
  const [selectedDateFilter, setSelectedDateFilter] = useState(getInitialDateFilter);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(getInitialAdvancedFilterState);
  
  // Create a snapshot of the current filter state
  const saveFilterStateSnapshot = useCallback(() => {
    try {
      const snapshot = {
        eventTypes: selectedEventTypes,
        venues: selectedVenues,
        dateRange: dateRange ? {
          from: dateRange.from?.toISOString(),
          to: dateRange.to?.toISOString()
        } : undefined,
        dateFilter: selectedDateFilter,
        timestamp: Date.now()
      };
      
      sessionStorage.setItem(FILTER_STATE_SNAPSHOT_KEY, JSON.stringify(snapshot));
      console.log('Filter state snapshot saved:', snapshot);
    } catch (e) {
      console.error('Error saving filter state snapshot:', e);
    }
  }, [selectedEventTypes, selectedVenues, dateRange, selectedDateFilter]);
  
  // Save filter states to sessionStorage and URL
  useEffect(() => {
    if (location.pathname.includes('/events')) {
      try {
        sessionStorage.setItem(VENUE_FILTERS_KEY, JSON.stringify(selectedVenues));
        
        // Update URL with venues
        const urlParams = new URLSearchParams(location.search);
        
        // Remove all existing venue parameters
        urlParams.delete('venue');
        
        // Add each venue as a separate parameter
        selectedVenues.forEach(venue => {
          urlParams.append('venue', venue);
        });
        
        // Store snapshot whenever filter state changes
        saveFilterStateSnapshot();
        
        // Don't navigate, just update the URL
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        
        // Only update if not during RSVP operation
        if (!window.rsvpInProgress) {
          window.history.replaceState({}, '', newUrl);
        }
      } catch (e) {
        console.error("Error saving venues:", e);
      }
    }
  }, [selectedVenues, location.pathname, location.search, saveFilterStateSnapshot]);
  
  useEffect(() => {
    if (location.pathname.includes('/events')) {
      try {
        // Store event types in session storage
        sessionStorage.setItem(EVENT_TYPES_KEY, JSON.stringify(selectedEventTypes));
        
        // Update URL with event types
        const urlParams = new URLSearchParams(location.search);
        
        // Remove all existing type parameters
        urlParams.delete('type');
        
        // Add each event type as a separate parameter
        selectedEventTypes.forEach(type => {
          urlParams.append('type', type);
        });
        
        // Store snapshot whenever filter state changes
        saveFilterStateSnapshot();
        
        // Don't navigate, just update the URL
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        
        // Only update if not during RSVP operation
        if (!window.rsvpInProgress) {
          window.history.replaceState({}, '', newUrl);
        }
      } catch (e) {
        console.error("Error saving event types:", e);
      }
    }
  }, [selectedEventTypes, location.pathname, location.search, saveFilterStateSnapshot]);
  
  useEffect(() => {
    if (location.pathname.includes('/events')) {
      try {
        // Store dateRange with ISO string dates for easier serialization
        const serializableRange = dateRange ? {
          from: dateRange.from?.toISOString(),
          to: dateRange.to?.toISOString()
        } : undefined;
        
        if (serializableRange) {
          sessionStorage.setItem(DATE_RANGE_KEY, JSON.stringify(serializableRange));
        } else {
          sessionStorage.removeItem(DATE_RANGE_KEY);
        }
        
        // Update URL with date range
        const urlParams = new URLSearchParams(location.search);
        if (dateRange?.from) {
          urlParams.set('dateFrom', dateRange.from.toISOString());
        } else {
          urlParams.delete('dateFrom');
        }
        
        if (dateRange?.to) {
          urlParams.set('dateTo', dateRange.to.toISOString());
        } else {
          urlParams.delete('dateTo');
        }
        
        // Store snapshot whenever filter state changes
        saveFilterStateSnapshot();
        
        // Don't navigate, just update the URL
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        
        // Only update if not during RSVP operation
        if (!window.rsvpInProgress) {
          window.history.replaceState({}, '', newUrl);
        }
      } catch (e) {
        console.error("Error saving date range:", e);
      }
    }
  }, [dateRange, location.pathname, location.search, saveFilterStateSnapshot]);
  
  useEffect(() => {
    if (location.pathname.includes('/events')) {
      try {
        if (selectedDateFilter) {
          sessionStorage.setItem(DATE_FILTER_KEY, selectedDateFilter);
        } else {
          sessionStorage.removeItem(DATE_FILTER_KEY);
        }
        
        // Update URL with date filter
        const urlParams = new URLSearchParams(location.search);
        if (selectedDateFilter) {
          urlParams.set('dateFilter', selectedDateFilter);
        } else {
          urlParams.delete('dateFilter');
        }
        
        // Store snapshot whenever filter state changes
        saveFilterStateSnapshot();
        
        // Don't navigate, just update the URL
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        
        // Only update if not during RSVP operation
        if (!window.rsvpInProgress) {
          window.history.replaceState({}, '', newUrl);
        }
      } catch (e) {
        console.error("Error saving date filter:", e);
      }
    }
  }, [selectedDateFilter, location.pathname, location.search, saveFilterStateSnapshot]);
  
  // Listen for filter restoration events with standardized parameter names
  useEffect(() => {
    const handleFilterRestoration = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Filter restoration event received in useEventFilterState:', customEvent.detail);
      
      if (customEvent.detail) {
        // Update event types if provided
        if (customEvent.detail.eventTypes && Array.isArray(customEvent.detail.eventTypes)) {
          console.log('Setting event types from restoration event:', customEvent.detail.eventTypes);
          setSelectedEventTypes(customEvent.detail.eventTypes);
        }
        
        // Parse URL parameters if provided
        if (customEvent.detail.urlParams) {
          try {
            const params = new URLSearchParams(customEvent.detail.urlParams);
            
            // Extract event types with standardized name 'type'
            const eventTypes = params.getAll('type');
            if (eventTypes && eventTypes.length > 0) {
              console.log('Setting event types from URL params:', eventTypes);
              setSelectedEventTypes(eventTypes);
            }
            
            // Store the restored state in window for other components
            if (typeof window !== 'undefined') {
              window._lastRestoredFilterState = {
                urlParams: customEvent.detail.urlParams,
                eventTypes: eventTypes.length > 0 ? eventTypes : customEvent.detail.eventTypes || [],
                timestamp: Date.now()
              };
            }
          } catch (e) {
            console.error('Error parsing URL params during filter restoration:', e);
          }
        }
      }
    };
    
    document.addEventListener('filtersRestored', handleFilterRestoration);
    
    return () => {
      document.removeEventListener('filtersRestored', handleFilterRestoration);
    };
  }, []);
  
  useEffect(() => {
    try {
      sessionStorage.setItem(ADVANCED_FILTERS_KEY, String(showAdvancedFilters));
    } catch (e) {
      console.error("Error saving advanced filters state:", e);
    }
  }, [showAdvancedFilters]);

  // Consider having active filters based on venues, date range or date filter
  // For event types, only consider it an active filter if not all types are selected
  const hasActiveFilters =
    selectedEventTypes.length > 0 ||
    selectedVenues.length > 0 ||
    dateRange !== undefined ||
    selectedDateFilter !== '';

  const hasAdvancedFilters =
    selectedVenues.length > 0 ||
    dateRange !== undefined ||
    selectedDateFilter !== '';

  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setDateRange(undefined);
    setSelectedDateFilter('');
    
    // Clear filter storage
    try {
      sessionStorage.removeItem(VENUE_FILTERS_KEY);
      sessionStorage.removeItem(DATE_RANGE_KEY);
      sessionStorage.removeItem(DATE_FILTER_KEY);
      sessionStorage.removeItem(EVENT_TYPES_KEY);
      sessionStorage.removeItem(FILTER_STATE_SNAPSHOT_KEY);
      
      // Update URL to remove filter parameters with standardized names
      const urlParams = new URLSearchParams(location.search);
      urlParams.delete('venue');
      urlParams.delete('dateFrom');
      urlParams.delete('dateTo');
      urlParams.delete('dateFilter');
      urlParams.delete('type');
      
      const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    } catch (e) {
      console.error("Error clearing filters:", e);
    }
  };

  const handleRemoveEventType = (type: string) => {
    setSelectedEventTypes((prev) => prev.filter((t) => t !== type));
  };

  const handleRemoveVenue = (venue: string) => {
    setSelectedVenues((prev) => prev.filter((v) => v !== venue));
  };

  const handleClearDateFilter = () => {
    setDateRange(undefined);
    setSelectedDateFilter('');
    
    // Clear date filter storage
    try {
      sessionStorage.removeItem(DATE_RANGE_KEY);
      sessionStorage.removeItem(DATE_FILTER_KEY);
      
      // Update URL to remove date filter parameters
      const urlParams = new URLSearchParams(location.search);
      urlParams.delete('dateFrom');
      urlParams.delete('dateTo');
      urlParams.delete('dateFilter');
      
      // Store updated snapshot
      saveFilterStateSnapshot();
      
      const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    } catch (e) {
      console.error("Error clearing date filters:", e);
    }
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(prev => !prev);
  };

  return {
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
    showAdvancedFilters,
    setShowAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
    saveFilterStateSnapshot
  };
};
