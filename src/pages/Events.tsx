
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { useAuth } from '@/contexts/AuthContext';
import { EventsPageContent } from '@/components/events/EventsPageContent';

const Events = () => {
  const { user } = useAuth();
  const {
    filteredEvents,
    eventsLoading,
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    hasActiveFilters,
    resetFilters,
    enhancedHandleRsvp,
    loadingEventId,
    allEventTypes
  } = useEventsPageData();

  // Create available event types and venues options
  const availableEventTypes = allEventTypes.map(type => ({
    value: type,
    label: type
  }));

  // For now, using empty venues array - this should be replaced with actual venue data
  const availableVenues: Array<{value: string, label: string}> = [];

  // Filter handlers
  const handleRemoveEventType = (type: string) => {
    setSelectedEventTypes(selectedEventTypes.filter(t => t !== type));
  };

  const handleRemoveVenue = (venue: string) => {
    setSelectedVenues(selectedVenues.filter(v => v !== venue));
  };

  const handleClearDateFilter = () => {
    setDateRange(undefined);
    setSelectedDateFilter('');
  };

  // Filter visibility states
  const [showEventTypeFilter, setShowEventTypeFilter] = React.useState(false);
  const [showVenueFilter, setShowVenueFilter] = React.useState(false);
  const [showDateFilter, setShowDateFilter] = React.useState(false);

  // For now, we'll assume all events are exact matches and no similar events
  const exactMatches = filteredEvents || [];
  const similarEvents: any[] = [];
  const showNoExactMatchesMessage = hasActiveFilters && exactMatches.length === 0;

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

      {/* Events Content */}
      <div className="bg-white">
        <EventsPageContent
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
          handleRemoveEventType={handleRemoveEventType}
          handleRemoveVenue={handleRemoveVenue}
          handleClearDateFilter={handleClearDateFilter}
          showNoExactMatchesMessage={showNoExactMatchesMessage}
          exactMatches={exactMatches}
          similarEvents={similarEvents}
          isLoading={eventsLoading}
          isFilterLoading={isFilterLoading}
          handleEventRsvp={enhancedHandleRsvp}
          user={user}
        />
      </div>
    </div>
  );
};

export default Events;
