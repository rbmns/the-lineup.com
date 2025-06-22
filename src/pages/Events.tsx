
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { LocationFilter } from '@/components/events/filters/LocationFilter';
import { useVenueLocationCategories } from '@/hooks/useVenueLocationCategories';
import { EventsAdvancedSection } from '@/components/events/page-sections/EventsAdvancedSection';
import { useIsMobile } from '@/hooks/use-mobile';

const Events = () => {
  const isMobile = useIsMobile();
  const {
    events,
    allEvents, // Add this to get all events for vibe filtering
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

  const { data: locationCategories = [], isLoading: locationsLoading } = useVenueLocationCategories();

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
        {/* Main Filters - Mobile First Layout */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-2 gap-6'}`}>
          {/* Vibe Filter - Full width on mobile, pass all events data */}
          <div className="w-full">
            <EventsVibeSection
              selectedVibes={selectedVibes}
              onVibeChange={setSelectedVibes}
              events={allEvents || []} // Pass all events to get available vibes
              vibesLoading={isLoading}
            />
          </div>
          
          {/* Location Filter - Full width on mobile */}
          <div className="w-full">
            <LocationFilter
              availableLocations={locationCategories}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              isLoading={locationsLoading}
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
