
import React from 'react';
import { EventFilterSection } from '@/components/events/filters/EventFilterSection';
import { FilterSummary } from '@/components/events/FilterSummary';

interface EventsAdvancedSectionProps {
  onFilterChange: (filters: any) => void;
  selectedEventTypes: string[];
  selectedVenues: string[];
  selectedVibes: string[];
  dateRange: any;
  selectedDateFilter: string;
  filteredEventsCount: number;
  allEventTypes: string[];
  availableVenues: any[];
}

export const EventsAdvancedSection: React.FC<EventsAdvancedSectionProps> = ({
  onFilterChange,
  selectedEventTypes,
  selectedVenues,
  selectedVibes,
  dateRange,
  selectedDateFilter,
  filteredEventsCount,
  allEventTypes,
  availableVenues
}) => {
  // Transform event types to the format expected by EventFilterSection
  const availableEventTypesFormatted = allEventTypes.map(type => ({
    value: type,
    label: type
  }));

  // Use actual venues from database instead of mock data
  const availableVenuesFormatted = availableVenues.map(venue => ({
    value: venue.id,
    label: venue.name
  }));

  const hasActiveFilters = selectedEventTypes.length > 0 || 
                          selectedVenues.length > 0 || 
                          (dateRange?.from !== undefined) || 
                          selectedDateFilter !== 'anytime';

  const resetFilters = () => {
    onFilterChange({
      eventTypes: [],
      venues: [],
      date: undefined,
      dateFilter: 'anytime'
    });
  };

  const handleRemoveEventType = (type: string) => {
    const newTypes = selectedEventTypes.filter(t => t !== type);
    onFilterChange({ eventTypes: newTypes });
  };

  const handleRemoveVenue = (venue: string) => {
    const newVenues = selectedVenues.filter(v => v !== venue);
    onFilterChange({ venues: newVenues });
  };

  const handleClearDateFilter = () => {
    onFilterChange({ 
      date: undefined,
      dateFilter: 'anytime'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <EventFilterSection
        showEventTypeFilter={false}
        setShowEventTypeFilter={() => {}}
        showVenueFilter={false}
        setShowVenueFilter={() => {}}
        showDateFilter={false}
        setShowDateFilter={() => {}}
        selectedEventTypes={selectedEventTypes}
        setSelectedEventTypes={(types) => onFilterChange({ eventTypes: types })}
        selectedVenues={selectedVenues}
        setSelectedVenues={(venues) => onFilterChange({ venues: venues })}
        dateRange={dateRange}
        setDateRange={(range) => onFilterChange({ date: range?.from })}
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={(filter) => onFilterChange({ dateFilter: filter })}
        availableEventTypes={availableEventTypesFormatted}
        availableVenues={availableVenuesFormatted}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Filter Summary */}
      {hasActiveFilters && (
        <FilterSummary 
          selectedEventTypes={selectedEventTypes}
          selectedVenues={selectedVenues}
          dateRange={dateRange}
          selectedDateFilter={selectedDateFilter}
          eventTypeOptions={availableEventTypesFormatted}
          venueOptions={availableVenuesFormatted}
          onRemoveEventType={handleRemoveEventType}
          onRemoveVenue={handleRemoveVenue}
          onClearDateFilter={handleClearDateFilter}
        />
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600 text-center">
        {filteredEventsCount} events found
      </div>
    </div>
  );
};
