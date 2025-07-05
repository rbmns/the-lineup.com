import React, { createContext, useContext, useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useLocation } from 'react-router-dom';

interface FilterStateContextType {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isNoneSelected: boolean;
  hasActiveFilters: boolean;
  showAdvancedFilters: boolean;
  toggleAdvancedFilters: () => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
  selectedVenues: string[];
  setSelectedVenues: (venues: string[]) => void;
  selectedVibes: string[];
  setSelectedVibes: (vibes: string[]) => void;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
  hasAdvancedFilters: boolean;
  handleRemoveVenue: (venue: string) => void;
  handleClearDateFilter: () => void;
  resetFilters: () => void;
  loadingEventId: string | null;
  setLoadingEventId: (id: string | null) => void;
}

const FilterStateContext = createContext<FilterStateContextType | undefined>(undefined);

export const FilterStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { data: events = [] } = useEvents(user?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // Get all unique event categories
  const allCategories = React.useMemo(() => {
    if (!events) return [];
    const categories = events
      .map(event => event.event_category)
      .filter((category): category is string => Boolean(category));
    return [...new Set(categories)].sort();
  }, [events]);

  // State management with URL synchronization
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  // Sync state from URL parameters on mount and location change
  useEffect(() => {
    const typeParams = searchParams.getAll('type');
    const vibeParams = searchParams.getAll('vibe');
    const venueParams = searchParams.getAll('venue');
    const dateFilterParam = searchParams.get('dateFilter');
    const locationParam = searchParams.get('location');
    const dateFromParam = searchParams.get('dateFrom');
    const dateToParam = searchParams.get('dateTo');

    // Update state from URL parameters
    if (typeParams.length > 0) {
      setSelectedCategories(typeParams);
    }
    if (vibeParams.length > 0) {
      setSelectedVibes(vibeParams);
    }
    if (venueParams.length > 0) {
      setSelectedVenues(venueParams);
    }
    if (dateFilterParam) {
      setSelectedDateFilter(dateFilterParam);
    }
    if (locationParam) {
      setSelectedLocation(locationParam);
    }
    if (dateFromParam) {
      const newDateRange: DateRange = {
        from: new Date(dateFromParam)
      };
      if (dateToParam) {
        newDateRange.to = new Date(dateToParam);
      }
      setDateRange(newDateRange);
    }
  }, [searchParams]);

  // Update URL when state changes
  const updateUrlParams = React.useCallback(() => {
    const newParams = new URLSearchParams();
    
    // Add categories
    selectedCategories.forEach(type => {
      newParams.append('type', type);
    });
    
    // Add vibes
    selectedVibes.forEach(vibe => {
      newParams.append('vibe', vibe);
    });
    
    // Add venues
    selectedVenues.forEach(venue => {
      newParams.append('venue', venue);
    });
    
    // Add date filter
    if (selectedDateFilter) {
      newParams.set('dateFilter', selectedDateFilter);
    }
    
    // Add location
    if (selectedLocation) {
      newParams.set('location', selectedLocation);
    }
    
    // Add date range
    if (dateRange?.from) {
      newParams.set('dateFrom', dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      newParams.set('dateTo', dateRange.to.toISOString());
    }
    
    setSearchParams(newParams, { replace: true });
  }, [selectedCategories, selectedVibes, selectedVenues, selectedDateFilter, selectedLocation, dateRange, setSearchParams]);

  // Debounced URL update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (location.pathname === '/events') {
        updateUrlParams();
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [selectedCategories, selectedVibes, selectedVenues, selectedDateFilter, selectedLocation, dateRange, location.pathname, updateUrlParams]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const selectAll = () => {
    setSelectedCategories(allCategories);
  };

  const deselectAll = () => {
    setSelectedCategories([]);
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(prev => !prev);
  };

  const handleRemoveVenue = (venue: string) => {
    setSelectedVenues(prev => prev.filter(v => v !== venue));
  };

  const handleClearDateFilter = () => {
    setSelectedDateFilter('');
    setDateRange(undefined);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedVenues([]);
    setSelectedVibes([]);
    setDateRange(undefined);
    setSelectedDateFilter('');
    setSelectedLocation(null);
  };

  const isNoneSelected = selectedCategories.length === 0;
  const hasAdvancedFilters = selectedVenues.length > 0 || !!dateRange || !!selectedDateFilter || selectedVibes.length > 0 || !!selectedLocation;
  const hasActiveFilters = selectedCategories.length > 0 || hasAdvancedFilters;

  return (
    <FilterStateContext.Provider value={{
      selectedCategories,
      toggleCategory,
      selectAll,
      deselectAll,
      isNoneSelected,
      hasActiveFilters,
      showAdvancedFilters,
      toggleAdvancedFilters,
      dateRange,
      setDateRange,
      selectedDateFilter,
      setSelectedDateFilter,
      selectedVenues,
      setSelectedVenues,
      selectedVibes,
      setSelectedVibes,
      selectedLocation,
      setSelectedLocation,
      hasAdvancedFilters,
      handleRemoveVenue,
      handleClearDateFilter,
      resetFilters,
      loadingEventId,
      setLoadingEventId
    }}>
      {children}
    </FilterStateContext.Provider>
  );
};

export const useFilterState = () => {
  const context = useContext(FilterStateContext);
  if (context === undefined) {
    throw new Error('useFilterState must be used within a FilterStateProvider');
  }
  return context;
};