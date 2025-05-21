
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
  hasAdvancedFilters: boolean;
  handleRemoveVenue: (venue: string) => void;
  handleClearDateFilter: () => void;
  resetFilters: () => void;
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
  hasAdvancedFilters,
  handleRemoveVenue,
  handleClearDateFilter,
  resetFilters
}) => {
  return (
    <>
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
