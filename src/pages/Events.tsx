
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { useVenueAreas } from '@/hooks/useVenueAreas';
import { EventsAdvancedSection } from '@/components/events/page-sections/EventsAdvancedSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useRsvpWithScrollPreservation } from '@/hooks/event-rsvp/useRsvpWithScrollPreservation';

const Events = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // Initialize RSVP handler with scroll preservation
  const { handleRsvp: enhancedHandleRsvp, loading: rsvpLoading } = useRsvpWithScrollPreservation(user?.id);
  
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
        {/* Vibe Filter */}
        <div className="w-full">
          <EventsVibeSection
            selectedVibes={selectedVibes}
            onVibeChange={setSelectedVibes}
            events={allEvents || []}
            vibesLoading={isLoading}
          />
        </div>

        {/* Advanced Filters Section - Now includes location */}
        <div className="w-full">
          <EventsAdvancedSection
            onFilterChange={handleFilterChange}
            selectedEventTypes={selectedEventTypes}
            selectedVenues={selectedVenues}
            selectedVibes={selectedVibes}
            selectedLocation={selectedLocation}
            dateRange={dateRange}
            selectedDateFilter={selectedDateFilter}
            filteredEventsCount={filteredEventsCount}
            allEventTypes={allEventTypes}
            availableVenues={availableVenues}
            events={allEvents || []}
            venueAreas={venueAreas}
            isLocationLoaded={isLocationLoaded}
            areasLoading={areasLoading}
          />
        </div>

        {/* Results Section */}
        <div className="w-full">
          <EventsResultsSection
            filteredEvents={events}
            hasActiveFilters={hasActiveFilters}
            resetFilters={resetAllFilters}
            eventsLoading={isLoading}
            isFilterLoading={false}
            user={user}
            enhancedHandleRsvp={enhancedHandleRsvp}
            loadingEventId={rsvpLoading ? 'loading' : undefined}
          />
        </div>
      </div>
    </EventsPageLayout>
  );
};

export default Events;
