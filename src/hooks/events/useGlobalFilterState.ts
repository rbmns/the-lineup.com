
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { useFilterStateContext } from '@/contexts/FilterStateContext';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';

export const useGlobalFilterState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filterState, setEventTypes, setVenues, setDateRange, setDateFilter, resetFilters: contextResetFilters } = useFilterStateContext();
  const { saveFilterState } = useNavigationHistory();
  
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(filterState.eventTypes || []);
  const [selectedVenues, setSelectedVenues] = useState<string[]>(filterState.venues || []);
  const [dateRange, setDateRangeState] = useState<DateRange | undefined>(filterState.dateRange);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(filterState.dateFilter || '');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  
  // Use refs to track previous values and prevent unnecessary updates
  const isInitialized = useRef(false);
  const previousSearch = useRef(location.search);
  const updatingFromUrl = useRef(false);
  const updatingUrl = useRef(false);

  // Initialize filters from URL parameters on first load
  useEffect(() => {
    if (!isInitialized.current) {
      const searchParams = new URLSearchParams(location.search);
      const types = searchParams.getAll('type');
      
      if (types.length > 0 && selectedEventTypes.length === 0) {
        console.log('Setting event types from URL:', types);
        setSelectedEventTypes(types);
        setEventTypes(types);
        saveFilterState({ eventTypes: types });
      }
      
      isInitialized.current = true;
    }
  }, [location.search, setEventTypes, selectedEventTypes.length, saveFilterState]);

  // Handle URL changes without triggering a update loop
  useEffect(() => {
    if (previousSearch.current !== location.search && !updatingUrl.current) {
      console.log('URL changed externally, updating filter state');
      updatingFromUrl.current = true;
      
      const searchParams = new URLSearchParams(location.search);
      const types = searchParams.getAll('type');
      
      if (types.length > 0) {
        setSelectedEventTypes(types);
        setEventTypes(types);
      }
      
      previousSearch.current = location.search;
      setTimeout(() => {
        updatingFromUrl.current = false;
      }, 100);
    }
  }, [location.search, setEventTypes]);

  // Sync local state with context state only when needed
  useEffect(() => {
    if (!updatingFromUrl.current && filterState.eventTypes) {
      setSelectedEventTypes(filterState.eventTypes);
    }
    setSelectedVenues(filterState.venues || []);
    setDateRangeState(filterState.dateRange);
    setSelectedDateFilter(filterState.dateFilter || '');
  }, [filterState]);

  // Handle updating the date range
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRangeState(range);
    setDateRange(range);
  };

  // Handle updating the date filter
  const handleDateFilterChange = (filter: string) => {
    setSelectedDateFilter(filter);
    setDateFilter(filter);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setDateRangeState(undefined);
    setSelectedDateFilter('');
    contextResetFilters();
    
    // Update URL to remove filter parameters
    updatingUrl.current = true;
    navigate('/events', { replace: true });
    previousSearch.current = '';
    setTimeout(() => {
      updatingUrl.current = false;
    }, 100);
  };

  // Handle removing a venue from the selected venues
  const handleRemoveVenue = (venue: string) => {
    const updatedVenues = selectedVenues.filter(v => v !== venue);
    setSelectedVenues(updatedVenues);
    setVenues(updatedVenues);
  };

  // Handle clearing the date filter
  const handleClearDateFilter = () => {
    setSelectedDateFilter('');
    setDateRangeState(undefined);
    setDateFilter('');
    setDateRange(undefined);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedEventTypes.length > 0 || 
                          selectedVenues.length > 0 || 
                          !!selectedDateFilter || 
                          (dateRange && dateRange.from !== undefined);

  // Check if any advanced filters are active
  const hasAdvancedFilters = selectedVenues.length > 0 || 
                            !!selectedDateFilter || 
                            (dateRange && dateRange.from !== undefined);

  return {
    selectedEventTypes,
    setSelectedEventTypes: (types: string[]) => {
      if (JSON.stringify(selectedEventTypes) !== JSON.stringify(types)) {
        setSelectedEventTypes(types);
        setEventTypes(types);
        
        // Don't update URL if we're already updating from URL
        if (!updatingFromUrl.current) {
          saveFilterState({ eventTypes: types });
        }
      }
    },
    selectedVenues,
    setSelectedVenues: (venues: string[]) => {
      setSelectedVenues(venues);
      setVenues(venues);
    },
    dateRange,
    setDateRange: handleDateRangeChange,
    selectedDateFilter,
    setSelectedDateFilter: handleDateFilterChange,
    resetFilters,
    handleRemoveVenue,
    handleClearDateFilter,
    hasActiveFilters,
    hasAdvancedFilters,
    isFilterLoading
  };
};
