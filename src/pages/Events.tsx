
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { FilterSummary } from '@/components/events/FilterSummary';
import { EventTypeIcon } from '@/components/ui/EventTypeIcon';
import { EventsList } from '@/components/events/EventsList';
import { EventTypesFilter } from '@/components/events/EventTypesFilter';
import { VenueFilter } from '@/components/events/VenueFilter';
import { EnhancedVibeFilter } from '@/components/events/EnhancedVibeFilter';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { DateFilterPill } from '@/components/events/DateFilterPill';
import { FilteredEventsList } from '@/components/events/FilteredEventsList';
import { EventsEmptyState } from '@/components/events/EventsEmptyState';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const Events = () => {
  useEventPageMeta();
  
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

  return (
    <div className="w-full">
      <EventsPageHeader 
        title="Discover Events"
        subtitle="Find surf, yoga, music and other coastal events happening near you"
      />
      
      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
          {/* Date Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Date:</span>
            <DateFilterPill 
              label="Today" 
              active={selectedDateFilter === "today"}
              onClick={() => setSelectedDateFilter(selectedDateFilter === "today" ? "" : "today")}
            />
            <DateFilterPill 
              label="Tomorrow" 
              active={selectedDateFilter === "tomorrow"}
              onClick={() => setSelectedDateFilter(selectedDateFilter === "tomorrow" ? "" : "tomorrow")}
            />
            <DateFilterPill 
              label="This Weekend" 
              active={selectedDateFilter === "this-weekend"}
              onClick={() => setSelectedDateFilter(selectedDateFilter === "this-weekend" ? "" : "this-weekend")}
            />
            <DateRangeFilter 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onReset={() => {
                setDateRange(undefined);
                setSelectedDateFilter('');
              }}
              selectedDateFilter={selectedDateFilter}
              onDateFilterChange={setSelectedDateFilter}
            />
          </div>

          {/* Event Type Filter */}
          <EventTypesFilter
            eventTypes={allEventTypes.map(type => ({ value: type, label: type }))}
            selectedEventTypes={selectedEventTypes.map(type => ({ value: type, label: type }))}
            onEventTypeChange={(types) => setSelectedEventTypes(types.map(t => t.value))}
          />

          {/* Vibe Filter */}
          <EnhancedVibeFilter
            vibes={vibes}
            selectedVibes={selectedVibes}
            onVibeChange={setSelectedVibes}
            isLoading={vibesLoading}
          />

          {/* Venue Filter */}
          <VenueFilter
            selectedVenues={selectedVenues}
            onVenueChange={setSelectedVenues}
          />

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <FilterSummary
                selectedEventTypes={selectedEventTypes}
                selectedVenues={selectedVenues}
                dateRange={dateRange}
                selectedDateFilter={selectedDateFilter}
                onRemoveEventType={(type) => setSelectedEventTypes(prev => prev.filter(t => t !== type))}
                onRemoveVenue={(venue) => setSelectedVenues(prev => prev.filter(v => v !== venue))}
                onRemoveDateRange={() => setDateRange(undefined)}
                onRemoveDateFilter={() => setSelectedDateFilter('')}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="ml-4 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {eventsLoading ? (
          <div className="text-center py-8">
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <EventsList 
            events={filteredEvents}
            onRsvp={enhancedHandleRsvp}
            loadingEventId={loadingEventId}
          />
        ) : (
          <EventsEmptyState
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default Events;
