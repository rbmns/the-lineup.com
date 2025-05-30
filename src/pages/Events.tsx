
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
    loadingEventId
  } = useEventsPageData();

  const [selectedVibe, setSelectedVibe] = React.useState<string | null>(null);

  const handleVibeChange = (vibe: string | null) => {
    setSelectedVibe(vibe);
    // TODO: Implement vibe filtering logic
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

  return (
    <EventsPageLayout>
      <EventsVibeSection
        selectedVibe={selectedVibe}
        onVibeChange={handleVibeChange}
      />

      <EventsAdvancedSection
        onFilterChange={handleAdvancedFilterChange}
        selectedEventTypes={selectedEventTypes}
        selectedVenues={selectedVenues}
        dateRange={dateRange}
        selectedDateFilter={selectedDateFilter}
        filteredEventsCount={filteredEvents.length}
      />

      <EventsResultsSection
        filteredEvents={filteredEvents}
        hasActiveFilters={hasActiveFilters}
        resetFilters={resetFilters}
        eventsLoading={eventsLoading}
        isFilterLoading={isFilterLoading}
        user={user}
        enhancedHandleRsvp={enhancedHandleRsvp}
        loadingEventId={loadingEventId}
      />
    </EventsPageLayout>
  );
};

export default Events;
