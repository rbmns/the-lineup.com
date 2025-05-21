
import React from 'react';
import { EventFilterBar } from '@/components/events/filters/EventFilterBar';
import { AdvancedFiltersToggle } from '@/components/events/filters/AdvancedFiltersToggle';
import { AdvancedFiltersPanel } from '@/components/events/filters/AdvancedFiltersPanel';
import { ActiveFiltersSummary } from '@/components/events/filters/ActiveFiltersSummary';

interface EventsFiltersSectionProps {
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

export const EventsFiltersSection: React.FC<EventsFiltersSectionProps> = ({
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
      {/* Events category filter bar */}
      <div className="mt-6 mb-4 overflow-x-auto">
        <EventFilterBar
          allEventTypes={allEventTypes}
          selectedEventTypes={selectedCategories}
          onToggleEventType={toggleCategory}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          hasActiveFilters={hasActiveFilters}
          className="py-2"
        />
      </div>
      
      {/* Advanced Filters Toggle */}
      <div className="mb-4">
        <AdvancedFiltersToggle 
          showAdvancedFilters={showAdvancedFilters}
          toggleAdvancedFilters={toggleAdvancedFilters}
        />
      </div>
      
      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <AdvancedFiltersPanel
          isOpen={showAdvancedFilters}
          onClose={() => toggleAdvancedFilters()}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedDateFilter={selectedDateFilter}
          onDateFilterChange={setSelectedDateFilter}
          venues={venues}
          selectedVenues={selectedVenues}
          onVenueChange={setSelectedVenues}
          locations={locations}
          className="mb-6"
        />
      )}
      
      {/* Active Filters Summary */}
      <ActiveFiltersSummary 
        selectedVenues={selectedVenues}
        venues={venues}
        dateRange={dateRange}
        selectedDateFilter={selectedDateFilter}
        hasAdvancedFilters={hasAdvancedFilters}
        handleRemoveVenue={handleRemoveVenue}
        handleClearDateFilter={handleClearDateFilter}
        resetFilters={resetFilters}
      />
    </>
  );
};
