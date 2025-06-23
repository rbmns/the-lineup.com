
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { LocationSelector } from '@/components/events/location/LocationSelector';
import { useVenueAreas } from '@/hooks/useVenueAreas';
import { EventsAdvancedSection } from '@/components/events/page-sections/EventsAdvancedSection';
import { useIsMobile } from '@/hooks/use-mobile';

const Events = () => {
  const isMobile = useIsMobile();
  const {
    events,
    allEvents,
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
    resetAllFilters,
    isLocationLoaded
  } = useEventsPageData();

  const { data: venueAreas = [], isLoading: areasLoading } = useVenueAreas();

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
      <div className="space-y-4 sm:space-y-6">
        {/* Location Selector - Prominent placement at the top */}
        <LocationSelector
          availableAreas={venueAreas}
          selectedAreaId={selectedLocation}
          onAreaChange={setSelectedLocation}
          events={allEvents || []}
          isLoading={areasLoading || !isLocationLoaded}
        />

        {/* Main Filters - Vibe only now, since location is handled above */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 gap-6'}`}>
          {/* Vibe Filter */}
          <div className="w-full">
            <EventsVibeSection
              selectedVibes={selectedVibes}
              onVibeChange={setSelectedVibes}
              events={allEvents || []}
              vibesLoading={isLoading}
            />
          </div>
        </div>

        {/* Advanced Filters Section - Mobile Optimized */}
        <div className="w-full">
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
            events={allEvents || []}
          />
        </div>

        {/* Results Section - Mobile Optimized */}
        <div className="w-full">
          <EventsResultsSection
            filteredEvents={events}
            hasActiveFilters={hasActiveFilters}
            resetFilters={resetAllFilters}
            eventsLoading={isLoading}
            isFilterLoading={false}
            user={null}
          />
        </div>
      </div>
    </EventsPageLayout>
  );
};

export default Events;
