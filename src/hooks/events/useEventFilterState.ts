import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { useLocation } from 'react-router-dom';

// Storage keys
const VENUE_FILTERS_KEY = 'event-venue-filters';
const DATE_RANGE_KEY = 'event-date-range';
const DATE_FILTER_KEY = 'event-date-filter';
const ADVANCED_FILTERS_KEY = 'event-advanced-filters';

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
          return stateDateRange;
        }
      }
      
      // Then check sessionStorage
      const stored = sessionStorage.getItem(DATE_RANGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.from || parsed.to)) {
          // Convert date strings back to Date objects
          const range: DateRange = {};
          if (parsed.from) range.from = new Date(parsed.from);
          if (parsed.to) range.to = new Date(parsed.to);
          return range;
        }
      }
      
      // Check URL parameters
      const urlParams = new URLSearchParams(location.search);
      const fromParam = urlParams.get('dateFrom');
      const toParam = urlParams.get('dateTo');
      if (fromParam || toParam) {
        const range: DateRange = {};
        if (fromParam) range.from = new Date(fromParam);
        if (toParam) range.to = new Date(toParam);
        return range;
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
    } catch (e) {
      console.error("Error reading stored date filter:", e);
    }
    return '';
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
  
  // Initialize with empty arrays instead of specific event types
  // This allows the parent component to populate with all event types if needed
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>(getInitialVenues);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getInitialDateRange);
  const [selectedDateFilter, setSelectedDateFilter] = useState(getInitialDateFilter);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(getInitialAdvancedFilterState);
  
  // Save filter states to sessionStorage and URL
  useEffect(() => {
    if (location.pathname.includes('/events')) {
      try {
        sessionStorage.setItem(VENUE_FILTERS_KEY, JSON.stringify(selectedVenues));
        
        // Update URL with venues
        const urlParams = new URLSearchParams(location.search);
        if (selectedVenues.length > 0) {
          urlParams.set('venues', encodeURIComponent(JSON.stringify(selectedVenues)));
        } else {
          urlParams.delete('venues');
        }
        
        // Don't navigate, just update the URL
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
      } catch (e) {
        console.error("Error saving venues:", e);
      }
    }
  }, [selectedVenues, location.pathname, location.search]);
  
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
        
        // Don't navigate, just update the URL
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
      } catch (e) {
        console.error("Error saving date range:", e);
      }
    }
  }, [dateRange, location.pathname, location.search]);
  
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
        
        // Don't navigate, just update the URL
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
      } catch (e) {
        console.error("Error saving date filter:", e);
      }
    }
  }, [selectedDateFilter, location.pathname, location.search]);
  
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
      
      // Update URL to remove filter parameters
      const urlParams = new URLSearchParams(location.search);
      urlParams.delete('venues');
      urlParams.delete('dateFrom');
      urlParams.delete('dateTo');
      urlParams.delete('dateFilter');
      
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
  };
};
