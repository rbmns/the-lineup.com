
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { EventsPageMeta } from '@/components/events/EventsPageMeta';
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
      <EventsPageMeta />
      <EventsPageHeader />
      
      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
          {/* Date Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Date:</span>
            <DateFilterPill 
              label="Today" 
              value="today" 
              selectedDateFilter={selectedDateFilter}
              onSelect={setSelectedDateFilter}
            />
            <DateFilterPill 
              label="Tomorrow" 
              value="tomorrow" 
              selectedDateFilter={selectedDateFilter}
              onSelect={setSelectedDateFilter}
            />
            <DateFilterPill 
              label="This Weekend" 
              value="this-weekend" 
              selectedDateFilter={selectedDateFilter}
              onSelect={setSelectedDateFilter}
            />
            <DateRangeFilter 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>

          {/* Event Type Filter */}
          <EventTypesFilter
            eventTypes={allEventTypes}
            selectedEventTypes={selectedEventTypes}
            onEventTypeChange={setSelectedEventTypes}
            isLoading={eventsLoading}
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
            isLoading={eventsLoading}
          />

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <FilterSummary
                selectedEventTypes={selectedEventTypes}
                selectedVenues={selectedVenues}
                selectedVibes={selectedVibes}
                dateRange={dateRange}
                selectedDateFilter={selectedDateFilter}
                onRemoveEventType={(type) => setSelectedEventTypes(prev => prev.filter(t => t !== type))}
                onRemoveVenue={(venue) => setSelectedVenues(prev => prev.filter(v => v !== venue))}
                onRemoveVibe={(vibe) => setSelectedVibes(prev => prev.filter(v => v !== vibe))}
                onRemoveDateRange={() => setDateRange(undefined)}
                onRemoveDateFilter={() => setSelectedDateFilter('')}
                allVibes={vibes}
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
          <FilteredEventsList 
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
