
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { LocationFilter } from '@/components/events/filters/LocationFilter';
import { useVenueLocations } from '@/hooks/useVenueLocations';
import { EventsAdvancedSection } from '@/components/events/page-sections/EventsAdvancedSection';

const Events = () => {
  const {
    events,
    isLoading,
    selectedVibes,
    selectedEventTypes,
    selectedVenues,
    selectedLocation,
    dateRange,
    selectedDateFilter,
    setSelectedVibes,
    setSelectedEventTypes,
    setSelectedVenues,
    setSelectedLocation,
    setDateRange,
    setSelectedDateFilter,
    allEventTypes,
    availableVenues,
    hasActiveFilters,
    resetAllFilters
  } = useEventsPageData();

  const { data: venueLocations = [], isLoading: locationsLoading } = useVenueLocations();

  const handleFilterChange = (filters: any) => {
    if (filters.eventTypes !== undefined) {
      setSelectedEventTypes(filters.eventTypes);
    }
    if (filters.venues !== undefined) {
      setSelectedVenues(filters.venues);
    }
    if (filters.vibes !== undefined) {
      setSelectedVibes(filters.vibes);
    }
    if (filters.location !== undefined) {
      setSelectedLocation(filters.location);
    }
    if (filters.date !== undefined) {
      setDateRange(filters.date);
    }
    if (filters.dateFilter !== undefined) {
      setSelectedDateFilter(filters.dateFilter);
    }
  };

  const filteredEventsCount = events?.length || 0;

  return (
    <EventsPageLayout>
      <div className="space-y-6">
        {/* Main Filters Row - Vibe and Location at same level */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vibe Filter */}
          <EventsVibeSection
            selectedVibes={selectedVibes}
            onVibeChange={setSelectedVibes}
            vibes={['general', 'energetic', 'chill', 'social', 'cultural']}
            vibesLoading={false}
          />
          
          {/* Location Filter */}
          <LocationFilter
            availableLocations={venueLocations}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            isLoading={locationsLoading}
          />
        </div>

        {/* Advanced Filters Section */}
        <EventsAdvancedSection
          onFilterChange={handleFilterChange}
          selectedEventTypes={selectedEventTypes}
          selectedVenues={selectedVenues}
          selectedVibes={selectedVibes}
          dateRange={dateRange}
          selectedDateFilter={selectedDateFilter}
          filteredEventsCount={filteredEventsCount}
          allEventTypes={allEventTypes}
          availableVenues={availableVenues}
        />

        {/* Results Section */}
        <EventsResultsSection
          filteredEvents={events}
          hasActiveFilters={hasActiveFilters}
          resetFilters={resetAllFilters}
          eventsLoading={isLoading}
          isFilterLoading={false}
          user={null}
        />
      </div>
    </EventsPageLayout>
  );
};

export default Events;
