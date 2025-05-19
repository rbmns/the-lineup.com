import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useCategoryFilterSelection } from '@/hooks/events/useCategoryFilterSelection';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { useEventFilterState } from '@/hooks/events/useEventFilterState';
import { EventSearch } from '@/components/events/search/EventSearch';
import { useSimilarEventsHandler } from '@/hooks/events/useSimilarEventsHandler';
import { useVenueData } from '@/hooks/events/useVenueData';
import { useEventTypeData } from '@/hooks/events/useEventTypeData';
import { useFilteredEvents } from '@/hooks/events/useFilteredEvents';
import { EventsFilterBar } from '@/components/events/page-components/EventsFilterBar';
import { EventsFilterPanel } from '@/components/events/page-components/EventsFilterPanel';
import { EventsResultsDisplay } from '@/components/events/page-components/EventsResultsDisplay';

const EventsPageRefactored = () => {
  useEventPageMeta();
  
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  
  // Get venue data
  const { venues, locations, isVenuesLoading } = useVenueData();
  
  // Get event type data
  const { allEventTypes } = useEventTypeData(events);
  
  // Event filter state management
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    showAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter
  } = useEventFilterState();
  
  // Filter events by selected event types - all selected by default
  const {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected
  } = useCategoryFilterSelection(allEventTypes);
  
  // Keep the category filter and event type filter in sync
  useEffect(() => {
    setSelectedEventTypes(selectedCategories);
  }, [selectedCategories, setSelectedEventTypes]);
  
  // Filter events based on selected criteria
  const filteredEvents = useFilteredEvents({
    events,
    selectedCategories,
    allEventTypes,
    selectedVenues,
    dateRange,
    selectedDateFilter
  });

  // Get similar events if no results match our filters but filters are active
  const { similarEvents = [] } = useSimilarEventsHandler({
    mainEvents: filteredEvents,
    hasActiveFilters,
    selectedEventTypes: selectedCategories,
    dateRange,
    selectedDateFilter,
    userId: user?.id
  });
  
  // RSVP handling
  const { 
    handleRsvp: enhancedHandleRsvp, 
    loadingEventId
  } = useEnhancedRsvp(user?.id);
  
  return (
    <div className="w-full px-4 md:px-6 py-4 md:py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="Upcoming Events" />
        
        {/* Search input */}
        <EventSearch className="mb-4 mt-4" />
        
        {/* Events category filter bar */}
        <EventsFilterBar
          allEventTypes={allEventTypes}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          selectAll={selectAll}
          deselectAll={deselectAll}
          hasActiveFilters={hasActiveFilters}
        />
        
        {/* Advanced Filters Panel & Filter Summary */}
        <EventsFilterPanel
          showAdvancedFilters={showAdvancedFilters}
          toggleAdvancedFilters={toggleAdvancedFilters}
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
          venues={venues}
          selectedVenues={selectedVenues}
          setSelectedVenues={setSelectedVenues}
          locations={locations}
          hasAdvancedFilters={hasAdvancedFilters}
          handleRemoveVenue={handleRemoveVenue}
          handleClearDateFilter={handleClearDateFilter}
          resetFilters={resetFilters}
        />
        
        {/* Events List with Results */}
        <EventsResultsDisplay
          filteredEvents={filteredEvents}
          similarEvents={similarEvents}
          isLoading={eventsLoading}
          isVenuesLoading={isVenuesLoading} 
          isFilterLoading={isFilterLoading}
          hasActiveFilters={hasActiveFilters}
          handleRsvp={user ? enhancedHandleRsvp : undefined}
          showRsvpButtons={!!user}
          loadingEventId={loadingEventId}
          isNoneSelected={isNoneSelected}
          selectAll={selectAll}
        />
      </div>
    </div>
  );
};

export default EventsPageRefactored;
