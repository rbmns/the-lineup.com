
import React from 'react';
import { EventFilterSection } from '@/components/events/filters/EventFilterSection';
import { FilterSummary } from '@/components/events/FilterSummary';

interface CategoryFilterControlsProps {
  showEventTypeFilter: boolean;
  setShowEventTypeFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showVenueFilter: boolean;
  setShowVenueFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showDateFilter: boolean;
  setShowDateFilter: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEventTypes: string[];
  setSelectedEventTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedVenues: string[];
  setSelectedVenues: React.Dispatch<React.SetStateAction<string[]>>;
  dateRange: any;
  setDateRange: React.Dispatch<React.SetStateAction<any>>;
  selectedDateFilter: string;
  setSelectedDateFilter: React.Dispatch<React.SetStateAction<string>>;
  availableEventTypes: Array<{value: string, label: string}>;
  availableVenues: Array<{value: string, label: string}>;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  onRemoveEventType: (type: string) => void;
  onRemoveVenue: (venue: string) => void;
  onClearDateFilter: () => void;
}

export const CategoryFilterControls: React.FC<CategoryFilterControlsProps> = ({
  showEventTypeFilter,
  setShowEventTypeFilter,
  showVenueFilter,
  setShowVenueFilter,
  showDateFilter,
  setShowDateFilter,
  selectedEventTypes,
  setSelectedEventTypes,
  selectedVenues,
  setSelectedVenues,
  dateRange,
  setDateRange,
  selectedDateFilter,
  setSelectedDateFilter,
  availableEventTypes,
  availableVenues,
  resetFilters,
  hasActiveFilters,
  onRemoveEventType,
  onRemoveVenue,
  onClearDateFilter
}) => {
  return (
    <>
      <EventFilterSection
        showEventTypeFilter={showEventTypeFilter}
        setShowEventTypeFilter={setShowEventTypeFilter}
        showVenueFilter={showVenueFilter}
        setShowVenueFilter={setShowVenueFilter}
        showDateFilter={showDateFilter}
        setShowDateFilter={setShowDateFilter}
        selectedEventTypes={selectedEventTypes}
        setSelectedEventTypes={setSelectedEventTypes}
        selectedVenues={selectedVenues}
        setSelectedVenues={setSelectedVenues}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={setSelectedDateFilter}
        availableEventTypes={availableEventTypes}
        availableVenues={availableVenues}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />
      
      <FilterSummary 
        selectedEventTypes={selectedEventTypes}
        selectedVenues={selectedVenues}
        dateRange={dateRange}
        selectedDateFilter={selectedDateFilter}
        eventTypeOptions={availableEventTypes}
        venueOptions={availableVenues}
        onRemoveEventType={onRemoveEventType}
        onRemoveVenue={onRemoveVenue}
        onClearDateFilter={onClearDateFilter}
      />
    </>
  );
};
