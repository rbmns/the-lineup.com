
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { useAuth } from '@/contexts/AuthContext';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { EventsAdvancedSection } from '@/components/events/page-sections/EventsAdvancedSection';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';

const Events = () => {
  const { user } = useAuth();
  const {
    filteredEvents,
    eventsLoading,
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    selectedVibes,
    setSelectedVibes,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    hasActiveFilters,
    resetFilters,
    enhancedHandleRsvp,
    loadingEventId,
    vibes,
    vibesLoading,
    allEventTypes
  } = useEventsPageData();

  const handleAdvancedFilterChange = (filters: any) => {
    console.log('Advanced filter change:', filters);
    
    if (filters.eventTypes) {
      setSelectedEventTypes(filters.eventTypes);
    }
    if (filters.venues) {
      setSelectedVenues(filters.venues);
    }
    if (filters.date) {
      // Fix: Properly handle Date to DateRange conversion
      setDateRange({ from: filters.date, to: filters.date });
    }
    if (filters.dateFilter && filters.dateFilter !== 'Any Date') {
      setSelectedDateFilter(filters.dateFilter.toLowerCase());
    }
  };

  const showNoExactMatchesMessage = hasActiveFilters && filteredEvents.length === 0;

  return (
    <div className="w-full bg-gradient-to-b from-secondary-25 to-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-secondary-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Find events that fit your <span className="text-vibrant-seafoam">vibe</span>
          </h1>
          <p className="text-xl text-neutral max-w-3xl mx-auto leading-relaxed mb-8">
            Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want.
          </p>
          <div className="flex justify-center items-center gap-6 text-2xl opacity-60">
            <span>🌊</span>
            <span>🧘</span>
            <span>🎶</span>
            <span>🏖️</span>
            <span>🎨</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white">
        <div className="space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
          {/* Vibe Filter Section */}
          <EventsVibeSection
            selectedVibes={selectedVibes}
            onVibeChange={setSelectedVibes}
            vibes={vibes}
            vibesLoading={vibesLoading}
          />

          {/* Advanced Filters Section */}
          <EventsAdvancedSection
            onFilterChange={handleAdvancedFilterChange}
            selectedEventTypes={selectedEventTypes}
            selectedVenues={selectedVenues}
            selectedVibes={selectedVibes}
            dateRange={dateRange}
            selectedDateFilter={selectedDateFilter}
            filteredEventsCount={filteredEvents.length}
            allEventTypes={allEventTypes}
          />

          {/* No Results Message */}
          {showNoExactMatchesMessage && (
            <NoResultsFound resetFilters={resetFilters} />
          )}

          {/* Events List */}
          <LazyEventsList 
            mainEvents={filteredEvents}
            relatedEvents={[]}
            isLoading={eventsLoading || isFilterLoading}
            onRsvp={user ? enhancedHandleRsvp : undefined}
            showRsvpButtons={!!user}
            hasActiveFilters={hasActiveFilters}
            loadingEventId={loadingEventId}
          />
        </div>
      </div>
    </div>
  );
};

export default Events;
