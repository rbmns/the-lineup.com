
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { EventsAdvancedSection } from '@/components/events/page-sections/EventsAdvancedSection';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';

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
    vibes,
    vibesLoading
  } = useEventsPageData();

  const [selectedVibe, setSelectedVibe] = React.useState<string | null>(null);

  const handleVibeChange = (vibe: string | null) => {
    setSelectedVibe(vibe);
    console.log('Vibe filter changed to:', vibe);
  };

  const handleAdvancedFilterChange = (filters: any) => {
    // Handle event category filters
    if (filters.eventTypes) {
      setSelectedEventTypes(filters.eventTypes);
    }
    
    // Handle venue filters
    if (filters.venues) {
      setSelectedVenues(filters.venues);
    }
    
    // Handle date filters - map from 'date' to 'dateRange'
    if (filters.date) {
      const dateRangeValue = { from: filters.date, to: filters.date };
      setDateRange(dateRangeValue);
    }
    
    if (filters.dateFilter) {
      setSelectedDateFilter(filters.dateFilter);
    }
  };

  // Filter events by selected vibe
  const vibeFilteredEvents = React.useMemo(() => {
    if (!selectedVibe) return filteredEvents;
    return filteredEvents.filter(event => event.vibe === selectedVibe);
  }, [filteredEvents, selectedVibe]);

  return (
    <EventsPageLayout>
      <div className="space-y-6 md:space-y-8">
        <EventsVibeSection
          selectedVibe={selectedVibe}
          onVibeChange={handleVibeChange}
          vibes={vibes}
          vibesLoading={vibesLoading}
        />

        <EventsAdvancedSection
          onFilterChange={handleAdvancedFilterChange}
          selectedEventTypes={selectedEventTypes}
          selectedVenues={selectedVenues}
          dateRange={dateRange}
          selectedDateFilter={selectedDateFilter}
          filteredEventsCount={vibeFilteredEvents.length}
          showLocationFilter={true}
        />

        <EventsResultsSection
          filteredEvents={vibeFilteredEvents}
          hasActiveFilters={hasActiveFilters || !!selectedVibe}
          resetFilters={() => {
            resetFilters();
            setSelectedVibe(null);
          }}
          eventsLoading={eventsLoading}
          isFilterLoading={isFilterLoading}
          user={user}
          enhancedHandleRsvp={enhancedHandleRsvp}
          loadingEventId={loadingEventId}
        />
      </div>
    </EventsPageLayout>
  );
};

export default Events;
