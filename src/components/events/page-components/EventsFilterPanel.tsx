
import React from 'react';
import { AdvancedFiltersToggle } from '@/components/events/filters/AdvancedFiltersToggle';
import { AdvancedFiltersPanel } from '@/components/events/filters/AdvancedFiltersPanel';
import { ActiveFiltersSummary } from '@/components/events/filters/ActiveFiltersSummary';
import { DateRange } from 'react-day-picker';

interface EventsFilterPanelProps {
  showAdvancedFilters: boolean;
  toggleAdvancedFilters: () => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
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
  // Event category props
  allEventTypes: string[];
  selectedCategories: string[];
  toggleCategory: (type: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  // Location/venue selection props
  selectedLocationId: string | null;
  onLocationChange: (id: string | null) => void;
}

export const EventsFilterPanel: React.FC<EventsFilterPanelProps> = ({
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
  resetFilters,
  allEventTypes,
  selectedCategories,
  toggleCategory,
  selectAll,
  deselectAll,
  selectedLocationId,
  onLocationChange
}) => {
  return (
    <>
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
          className="mb-8"
          allEventTypes={allEventTypes}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          selectAll={selectAll}
          deselectAll={deselectAll}
          selectedLocationId={selectedLocationId}
          onLocationChange={onLocationChange}
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
        className="mb-8"
      />
    </>
  );
};
