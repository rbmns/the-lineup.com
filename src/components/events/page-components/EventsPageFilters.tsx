
import React from 'react';
import { EventSearch } from '@/components/events/search/EventSearch';
import { EventsFilterBar } from '@/components/events/page-components/EventsFilterBar';
import { EventsFilterPanel } from '@/components/events/page-components/EventsFilterPanel';

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
  return (
    <>
      {/* Search input */}
      <EventSearch className="mb-4 mt-4" />
      
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
