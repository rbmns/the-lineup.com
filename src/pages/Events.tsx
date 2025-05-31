
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FilterStateProvider } from '@/contexts/FilterStateContext';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { EventsAdvancedSection } from '@/components/events/page-sections/EventsAdvancedSection';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';
import { EventCategoryFilters } from '@/components/events/filters/EventCategoryFilters';

const EventsContent = () => {
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
    console.log('Handling advanced filter change:', filters);
    
    // Handle event category filters
    if (filters.eventTypes !== undefined) {
      console.log('Setting event types:', filters.eventTypes);
      setSelectedEventTypes(filters.eventTypes);
    }
    
    // Handle venue filters
    if (filters.venues !== undefined) {
      console.log('Setting venues:', filters.venues);
      setSelectedVenues(filters.venues);
    }
    
    // Handle vibe filters - updated to use eventVibes
    if (filters.eventVibes !== undefined) {
      console.log('Setting vibes:', filters.eventVibes);
      setSelectedVibes(filters.eventVibes);
    }
    
    // Handle date filters - map from 'date' to 'dateRange'
    if (filters.date) {
      console.log('Setting date range:', filters.date);
      const dateRangeValue = { from: filters.date, to: filters.date };
      setDateRange(dateRangeValue);
    }
    
    if (filters.dateFilter !== undefined) {
      console.log('Setting date filter:', filters.dateFilter);
      setSelectedDateFilter(filters.dateFilter);
    }
  };

  const handleSelectAll = () => {
    setSelectedEventTypes(allEventTypes);
  };

  const handleDeselectAll = () => {
    setSelectedEventTypes([]);
  };

  const handleToggleEventType = (eventType: string) => {
    const isSelected = selectedEventTypes.includes(eventType);
    
    if (isSelected) {
      // Remove the event type
      setSelectedEventTypes(selectedEventTypes.filter(type => type !== eventType));
    } else {
      // Add the event type
      setSelectedEventTypes([...selectedEventTypes, eventType]);
    }
  };

  // Create a wrapper that ensures the return type is Promise<boolean>
  const handleRsvpWithCorrectReturnType = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    try {
      await enhancedHandleRsvp(eventId, status);
      // Since enhancedHandleRsvp returns void, we assume success if no error is thrown
      return true;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      return false;
    }
  };

  console.log('Current filter state:', {
    selectedEventTypes,
    selectedVenues,
    selectedVibes,
    filteredEventsCount: filteredEvents.length,
    allEventTypes
  });

  return (
    <EventsPageLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Main Category Filters */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Browse Events</h2>
          <EventCategoryFilters
            allEventTypes={allEventTypes}
            selectedEventTypes={selectedEventTypes}
            onToggleEventType={handleToggleEventType}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            className="w-full"
          />
        </div>

        <EventsVibeSection
          selectedVibes={selectedVibes}
          onVibeChange={(vibes) => {
            console.log('Vibe section changed:', vibes);
            setSelectedVibes(vibes);
          }}
          vibes={vibes}
          vibesLoading={vibesLoading}
        />

        <EventsAdvancedSection
          onFilterChange={handleAdvancedFilterChange}
          selectedEventTypes={selectedEventTypes}
          selectedVenues={selectedVenues}
          selectedVibes={selectedVibes}
          dateRange={dateRange}
          selectedDateFilter={selectedDateFilter}
          filteredEventsCount={filteredEvents.length}
          showLocationFilter={true}
          allEventTypes={allEventTypes}
        />

        <EventsResultsSection
          filteredEvents={filteredEvents}
          hasActiveFilters={hasActiveFilters}
          resetFilters={resetFilters}
          eventsLoading={eventsLoading}
          isFilterLoading={isFilterLoading}
          user={user}
          enhancedHandleRsvp={handleRsvpWithCorrectReturnType}
          loadingEventId={loadingEventId}
        />
      </div>
    </EventsPageLayout>
  );
};

const Events = () => {
  return (
    <FilterStateProvider>
      <EventsContent />
    </FilterStateProvider>
  );
};

export default Events;
