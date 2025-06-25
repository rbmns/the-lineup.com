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
  const {
    user
  } = useAuth();

  // Initialize RSVP handler with scroll preservation
  const {
    handleRsvp: enhancedHandleRsvp,
    loading: rsvpLoading
  } = useRsvpWithScrollPreservation(user?.id);
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
  const {
    data: venueAreas = [],
    isLoading: areasLoading
  } = useVenueAreas();
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

  // Wrapper function to match the expected signature and ensure proper return type
  const handleRsvpWrapper = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    const result = await enhancedHandleRsvp(eventId, status);
    return result;
  };
  return <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-[#F9F3E9] to-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005F73] mb-4 leading-tight">
            Discover <span className="text-[#2A9D8F]">Events</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#4A4A48] max-w-3xl mx-auto leading-relaxed">Discover what's happening nearby — from beach parties to chill yoga sessions. </p>
        </div>
      </div>

      <EventsPageLayout>
        <div className="space-y-4 sm:space-y-6">
          {/* Vibe Filter */}
          <div className="w-full">
            <EventsVibeSection selectedVibes={selectedVibes} onVibeChange={setSelectedVibes} events={allEvents || []} vibesLoading={isLoading} />
          </div>

          {/* Advanced Filters Section - Now includes location */}
          <div className="w-full">
            <EventsAdvancedSection onFilterChange={handleFilterChange} selectedEventTypes={selectedEventTypes} selectedVenues={selectedVenues} selectedVibes={selectedVibes} selectedLocation={selectedLocation} dateRange={dateRange} selectedDateFilter={selectedDateFilter} filteredEventsCount={filteredEventsCount} allEventTypes={allEventTypes} availableVenues={availableVenues} events={allEvents || []} venueAreas={venueAreas} isLocationLoaded={isLocationLoaded} areasLoading={areasLoading} />
          </div>

          {/* Results Section */}
          <div className="w-full">
            <EventsResultsSection filteredEvents={events} hasActiveFilters={hasActiveFilters} resetFilters={resetAllFilters} eventsLoading={isLoading} isFilterLoading={false} user={user} enhancedHandleRsvp={handleRsvpWrapper} loadingEventId={rsvpLoading ? 'loading' : undefined} />
          </div>
        </div>
      </EventsPageLayout>
    </div>;
};
export default Events;