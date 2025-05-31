
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { useEventVibes } from '@/hooks/useEventVibes';

interface FilterState {
  selectedCategories: string[];
  toggleCategory: (type: string) => void;
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
  hasAdvancedFilters: boolean;
  handleRemoveVenue: (venue: string) => void;
  handleClearDateFilter: () => void;
  resetFilters: () => void;
  loadingEventId: string | null;
  setLoadingEventId: (id: string | null) => void;
}

const FilterStateContext = createContext<FilterState | undefined>(undefined);

export const FilterStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  
  const { data: vibes = [] } = useEventVibes();

  // Initialize selectedVibes with all vibes when vibes data is loaded
  useEffect(() => {
    if (vibes.length > 0 && selectedVibes.length === 0) {
      setSelectedVibes(vibes);
    }
  }, [vibes, selectedVibes.length]);

  const toggleCategory = (type: string) => {
    setSelectedCategories(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const selectAll = () => {
    // This will be set by the EventsDataProvider based on available event types
    setSelectedCategories([]);
  };

  const deselectAll = () => {
    setSelectedCategories([]);
  };

  const isNoneSelected = selectedCategories.length === 0;

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedVenues.length > 0 || 
                          (selectedVibes.length > 0 && selectedVibes.length < vibes.length) ||
                          !!dateRange || 
                          !!selectedDateFilter;

  const hasAdvancedFilters = selectedVenues.length > 0 || !!dateRange || !!selectedDateFilter;

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const handleRemoveVenue = (venue: string) => {
    setSelectedVenues(prev => prev.filter(v => v !== venue));
  };

  const handleClearDateFilter = () => {
    setDateRange(undefined);
    setSelectedDateFilter('');
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedVenues([]);
    setSelectedVibes(vibes); // Reset to all vibes
    setDateRange(undefined);
    setSelectedDateFilter('');
    setShowAdvancedFilters(false);
  };

  const value: FilterState = {
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
    hasAdvancedFilters,
    handleRemoveVenue,
    handleClearDateFilter,
    resetFilters,
    loadingEventId,
    setLoadingEventId
  };

  return (
    <FilterStateContext.Provider value={value}>
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
