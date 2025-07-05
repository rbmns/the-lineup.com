import React, { createContext, useContext, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';

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
  
  // Get all unique event categories
  const allCategories = React.useMemo(() => {
    if (!events) return [];
    const categories = events
      .map(event => event.event_category)
      .filter((category): category is string => Boolean(category));
    return [...new Set(categories)].sort();
  }, [events]);

  // Simple state management without URL sync for now
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

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