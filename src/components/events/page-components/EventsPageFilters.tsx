
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { EventsFilterBar } from '@/components/events/page-components/EventsFilterBar';
import { EventsFilterPanel } from '@/components/events/page-components/EventsFilterPanel';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';

interface EventsPageFiltersProps {
  allEventTypes: string[];
  selectedCategories: string[];
  toggleCategory: (type: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  hasActiveFilters: boolean;
  showAdvancedFilters: boolean;
  toggleAdvancedFilters: () => void;
  dateRange: any;
  setDateRange: (range: any) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
  venues: Array<{ value: string, label: string }>;
  selectedVenues: string[];
  setSelectedVenues: (venues: string[]) => void;
  locations: Array<{ value: string, label: string }>;
  hasAdvancedFilters: boolean;
  handleRemoveVenue: (venue: string) => void;
  handleClearDateFilter: () => void;
  resetFilters: () => void;
}

export const EventsPageFilters: React.FC<EventsPageFiltersProps> = ({
  allEventTypes,
  selectedCategories,
  toggleCategory,
  selectAll,
  deselectAll,
  hasActiveFilters,
  showAdvancedFilters,
  toggleAdvancedFilters,
  dateRange,
  setDateRange,
  selectedDateFilter,
  setSelectedDateFilter,
  venues,
  selectedVenues,
  setSelectedVenues,
  locations,
  hasAdvancedFilters,
  handleRemoveVenue,
  handleClearDateFilter,
  resetFilters
}) => {
  const location = useLocation();
  const { saveFilterState } = useNavigationHistory();
  const lastSavedFilter = useRef<string>('');
  
  // Save filter state whenever it changes, with debounce to prevent excessive saves
  useEffect(() => {
    if (location.pathname === '/events') {
      const filterState = {
        eventTypes: selectedCategories,
        venues: selectedVenues,
        dateRange: dateRange,
        dateFilter: selectedDateFilter
      };
      
      // Only save if state has actually changed
      const stateString = JSON.stringify(filterState);
      if (stateString !== lastSavedFilter.current) {
        lastSavedFilter.current = stateString;
        
        // Debounce the save operation
        const timer = setTimeout(() => {
          saveFilterState(filterState);
          console.log("Filter state saved in EventsPageFilters", filterState);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }
  }, [
    location.pathname,
    selectedCategories,
    selectedVenues,
    dateRange,
    selectedDateFilter,
    saveFilterState
  ]);

  return (
    <>
      {/* Events category filter bar */}
      <EventsFilterBar
        allEventTypes={allEventTypes}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        selectAll={selectAll}
        deselectAll={deselectAll}
        hasActiveFilters={hasActiveFilters}
      />
      
      {/* Advanced Filters Panel & Filter Summary */}
      <EventsFilterPanel
        showAdvancedFilters={showAdvancedFilters}
        toggleAdvancedFilters={toggleAdvancedFilters}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={setSelectedDateFilter}
        venues={venues}
        selectedVenues={selectedVenues}
        setSelectedVenues={setSelectedVenues}
        locations={locations}
        hasAdvancedFilters={hasAdvancedFilters}
        handleRemoveVenue={handleRemoveVenue}
        handleClearDateFilter={handleClearDateFilter}
        resetFilters={resetFilters}
      />
    </>
  );
};
