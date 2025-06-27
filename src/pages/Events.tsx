
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { useVenueAreas } from '@/hooks/useVenueAreas';
import { EventsAdvancedSection } from '@/components/events/page-sections/EventsAdvancedSection';
import { LocationFilter } from '@/components/events/filters/LocationFilter';
import { EventSearch } from '@/components/events/search/EventSearch';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedRsvp } from '@/hooks/useUnifiedRsvp';

const Events = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { handleRsvp, loadingEventId } = useUnifiedRsvp();

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

  // Transform venue data to match expected format
  const transformedAvailableVenues = availableVenues.map(venue => ({
    value: venue.id,
    label: venue.name
  }));

  return (
    <div className="min-h-screen w-full">
      {/* Compact Header Section */}
      <div className="w-full px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#005F73] leading-tight">
            Discover <span className="text-[#2A9D8F]">Events</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4A4A48] max-w-xl mx-auto leading-relaxed">
            Discover what's happening nearby — from beach parties to chill yoga sessions.
          </p>
        </div>
      </div>

      {/* Compact Content */}
      <div className="w-full px-3 sm:px-4 lg:px-8">
        <div className="space-y-2 sm:space-y-3">
          {/* Compact Search and Location Row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
            <div className="flex-1 min-w-0">
              <EventSearch 
                placeholder="Search events..." 
                className="w-full h-10"
                square={true}
              />
            </div>
            <div className="sm:w-48 flex-shrink-0">
              <LocationFilter
                venueAreas={venueAreas}
                selectedLocationId={selectedLocation}
                onLocationChange={setSelectedLocation}
                isLoading={areasLoading}
                isLocationLoaded={isLocationLoaded}
                className="w-full"
                compact={true}
              />
            </div>
          </div>

          {/* Compact Vibe Filter */}
          <div className="w-full">
            <EventsVibeSection 
              selectedVibes={selectedVibes} 
              onVibeChange={setSelectedVibes} 
              events={allEvents || []} 
              vibesLoading={isLoading} 
            />
          </div>

          {/* Compact Advanced Filters Section */}
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
              availableVenues={transformedAvailableVenues}
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
              enhancedHandleRsvp={handleRsvp} 
              loadingEventId={loadingEventId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
