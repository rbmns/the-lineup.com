import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { useFilterStateContext } from '@/contexts/FilterStateContext';

export const useGlobalFilterState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filterState, setEventTypes, setVenues, setDateRange, setDateFilter, resetFilters: contextResetFilters } = useFilterStateContext();
  
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(filterState.eventTypes || []);
  const [selectedVenues, setSelectedVenues] = useState<string[]>(filterState.venues || []);
  const [dateRange, setDateRangeState] = useState<DateRange | undefined>(filterState.dateRange);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(filterState.dateFilter || '');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Initialize filters from URL parameters on first load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const types = searchParams.getAll('type');
    
    if (types.length > 0 && selectedEventTypes.length === 0) {
      console.log('Setting event types from URL:', types);
      setSelectedEventTypes(types);
      setEventTypes(types);
    }
    
    // Other initialization logic for venues, date filters, etc.
  }, [location.search, setEventTypes, selectedEventTypes.length]);

  // Sync local state with context state
  useEffect(() => {
    setSelectedEventTypes(filterState.eventTypes || []);
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
    navigate('/events', { replace: true });
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
      setSelectedEventTypes(types);
      setEventTypes(types);
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
