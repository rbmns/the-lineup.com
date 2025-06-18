
import React, { createContext, useContext, useState, useEffect } from 'react';
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
    return Array.from(new Set(
      events
        .filter(event => event.event_category)
        .map(event => event.event_category as string)
    )).sort();
  }, [events]);

  // Initialize with empty array (show all by default)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
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
    setSelectedCategories([]); // Reset to empty array (show all)
    setSelectedVenues([]);
    setSelectedVibes([]);
    setDateRange(undefined);
    setSelectedDateFilter('');
  };

  const isNoneSelected = selectedCategories.length === 0;
  const hasAdvancedFilters = selectedVenues.length > 0 || !!dateRange || !!selectedDateFilter || selectedVibes.length > 0;
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
