
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useEventsFiltering } from '@/hooks/events/useEventsFiltering';
import { useUrlFilters } from '@/hooks/events/useUrlFilters';
import { useLocation } from 'react-router-dom';
import { usePreservedRsvp } from '@/hooks/usePreservedRsvp';
import { useEventListState } from '@/hooks/events/useEventListState';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { useEventFilterProcessor } from '@/hooks/events/useEventFilterProcessor';
import { useScrollPositionHandler } from '@/hooks/events/useScrollPositionHandler';
import { useSimilarEventsHandler } from '@/hooks/events/useSimilarEventsHandler';
import { useFilterRemovalHandlers } from '@/hooks/events/useFilterRemovalHandlers';
import { useRsvpHandler } from '@/hooks/events/useRsvpHandler';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { EventsPageContent } from '@/components/events/EventsPageContent';
import { Event } from '@/types';

const EventsPageRefactored = () => {
  // Apply meta tags and canonical URL
  useEventPageMeta();
  
  const { user } = useAuth();
  const { data: events = [], isLoading } = useEvents(user?.id);
  const { handleRsvp, loading: rsvpLoading } = usePreservedRsvp(user?.id);
  const location = useLocation();
  
  // Get state management hooks
  const { 
    similarEvents, 
    setSimilarEvents, 
    initialRenderRef, 
    scrollRestoredRef, 
    rsvpInProgressRef 
  } = useEventListState();
  
  // Get filtering hooks
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    availableEventTypes,
    availableVenues,
    filteredEvents,
    showEventTypeFilter,
    setShowEventTypeFilter,
    showVenueFilter,
    setShowVenueFilter,
    showDateFilter,
    setShowDateFilter,
    selectedDateFilter,
    setSelectedDateFilter,
    resetFilters,
    hasActiveFilters,
    isFilterLoading,
    fetchSimilarEvents
  } = useEventsFiltering(events, user?.id);

  // Sync URL parameters with filter state
  useUrlFilters(
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter
  );

  // Handle scroll position restoration
  useScrollPositionHandler(
    initialRenderRef,
    scrollRestoredRef,
    rsvpInProgressRef,
    filteredEvents
  );

  // Process events with filters
  const { exactMatches, displayEvents } = useEventFilterProcessor(
    filteredEvents, 
    events, 
    selectedDateFilter, 
    dateRange
  );
  
  const hasExactMatches = exactMatches.length > 0;
  const showNoExactMatchesMessage = hasActiveFilters && !hasExactMatches;
  
  // Handle similar events loading
  useSimilarEventsHandler(
    exactMatches,
    hasActiveFilters,
    selectedEventTypes,
    fetchSimilarEvents,
    setSimilarEvents
  );

  // Handle filter removal actions
  const {
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter
  } = useFilterRemovalHandlers(
    setSelectedEventTypes,
    setSelectedVenues,
    setDateRange,
    setSelectedDateFilter
  );

  // Handle RSVP actions
  const { handleEventRsvp } = useRsvpHandler(user, handleRsvp, rsvpInProgressRef);

  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="What's Happening?" />
        
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
          isLoading={isLoading}
          isFilterLoading={isFilterLoading}
          rsvpLoading={rsvpLoading}
          handleEventRsvp={handleEventRsvp}
          user={user}
        />
      </div>
    </div>
  );
};

export default EventsPageRefactored;
