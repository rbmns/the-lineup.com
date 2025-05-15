
import React from 'react';
import { useEventsFiltering } from '@/hooks/events/useEventsFiltering';
import { EventFilterSection } from '@/components/events/filters/EventFilterSection';
import { FilterSummary } from '@/components/events/FilterSummary';
import { toast } from 'sonner';
import { Event } from '@/types';

interface EventFilterControllerProps {
  events: Event[];
  userId?: string;
  onFilteredEventsChange: (events: Event[]) => void;
  onActiveFiltersChange: (hasActiveFilters: boolean) => void;
  onFilterLoadingChange: (isLoading: boolean) => void;
  onSelectedEventTypesChange: (types: string[]) => void;
  onSelectedVenuesChange: (venues: string[]) => void;
}

export const EventFilterController: React.FC<EventFilterControllerProps> = ({
  events,
  userId,
  onFilteredEventsChange,
  onActiveFiltersChange,
  onFilterLoadingChange,
  onSelectedEventTypesChange,
  onSelectedVenuesChange
}) => {
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    availableEventTypes,
    availableVenues,
    filteredEvents,
    showEventTypeFilter,
    setShowEventTypeFilter,
    showVenueFilter,
    setShowVenueFilter,
    showDateFilter,
    setShowDateFilter,
    selectedDateFilter,
    setSelectedDateFilter,
    resetFilters,
    hasActiveFilters,
    isFilterLoading,
  } = useEventsFiltering(events, userId);

  // Notify parent components about filter changes
  React.useEffect(() => {
    onFilteredEventsChange(filteredEvents);
  }, [filteredEvents, onFilteredEventsChange]);

  React.useEffect(() => {
    onActiveFiltersChange(hasActiveFilters);
  }, [hasActiveFilters, onActiveFiltersChange]);

  React.useEffect(() => {
    onFilterLoadingChange(isFilterLoading);
  }, [isFilterLoading, onFilterLoadingChange]);
  
  // Update parent with selected event types
  React.useEffect(() => {
    onSelectedEventTypesChange(selectedEventTypes);
  }, [selectedEventTypes, onSelectedEventTypesChange]);
  
  // Update parent with selected venues
  React.useEffect(() => {
    onSelectedVenuesChange(selectedVenues);
  }, [selectedVenues, onSelectedVenuesChange]);

  // Handle removing individual filter categories
  const handleRemoveEventType = (type: string) => {
    // Create a new array instead of modifying the existing one
    const newTypes = selectedEventTypes.filter(t => t !== type);
    setSelectedEventTypes(newTypes);
    toast.success(`Removed filter: ${availableEventTypes.find(et => et.value === type)?.label || type}`);
  };
  
  const handleRemoveVenue = (venue: string) => {
    // Create a new array instead of modifying the existing one
    const newVenues = selectedVenues.filter(v => v !== venue);
    setSelectedVenues(newVenues);
    toast.success(`Removed filter: ${availableVenues.find(v => v.value === venue)?.label || venue}`);
  };
  
  const handleClearDateFilter = () => {
    setDateRange(undefined);
    setSelectedDateFilter('');
    toast.success("Date filter cleared");
  };

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
        onRemoveEventType={handleRemoveEventType}
        onRemoveVenue={handleRemoveVenue}
        onClearDateFilter={handleClearDateFilter}
      />
    </>
  );
};
