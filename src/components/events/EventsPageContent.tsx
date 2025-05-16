import React from 'react';
import { EventFilterSection } from '@/components/events/filters/EventFilterSection';
import { FilterSummary } from '@/components/events/FilterSummary';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { LazyEventsList } from '@/components/events/LazyEventsList';

interface EventsPageContentProps {
  showEventTypeFilter: boolean;
  setShowEventTypeFilter: (show: boolean) => void;
  showVenueFilter: boolean;
  setShowVenueFilter: (show: boolean) => void;
  showDateFilter: boolean;
  setShowDateFilter: (show: boolean) => void;
  selectedEventTypes: string[];
  setSelectedEventTypes: (types: string[]) => void;
  selectedVenues: string[];
  setSelectedVenues: (venues: string[]) => void;
  dateRange: any;
  setDateRange: (range: any) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
  availableEventTypes: Array<{value: string, label: string}>;
  availableVenues: Array<{value: string, label: string}>;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  handleRemoveEventType: (type: string) => void;
  handleRemoveVenue: (venue: string) => void;
  handleClearDateFilter: () => void;
  showNoExactMatchesMessage: boolean;
  exactMatches: any[];
  similarEvents: any[];
  isLoading: boolean;
  isFilterLoading: boolean;
  // rsvpLoading: boolean; // This prop is part of EventsPageContentProps but not directly used by LazyEventsList anymore
  handleEventRsvp: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  user: any;
}

export const EventsPageContent: React.FC<EventsPageContentProps> = ({
  showEventTypeFilter,
  setShowEventTypeFilter,
  showVenueFilter,
  setShowVenueFilter,
  showDateFilter,
  setShowDateFilter,
  selectedEventTypes,
  setSelectedEventTypes,
  selectedVenues,
  setSelectedVenues,
  dateRange,
  setDateRange,
  selectedDateFilter,
  setSelectedDateFilter,
  availableEventTypes,
  availableVenues,
  resetFilters,
  hasActiveFilters,
  handleRemoveEventType,
  handleRemoveVenue,
  handleClearDateFilter,
  showNoExactMatchesMessage,
  exactMatches,
  similarEvents,
  isLoading,
  isFilterLoading,
  // rsvpLoading, // This prop is part of EventsPageContentProps but not directly used by LazyEventsList anymore
  handleEventRsvp,
  user
}) => {
  return (
    <div className="space-y-12">
      <EventFilterSection
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
      />
      
      <FilterSummary 
        selectedEventTypes={selectedEventTypes}
        selectedVenues={selectedVenues}
        dateRange={dateRange}
        selectedDateFilter={selectedDateFilter}
        eventTypeOptions={availableEventTypes}
        venueOptions={availableVenues}
        onRemoveEventType={handleRemoveEventType}
        onRemoveVenue={handleRemoveVenue}
        onClearDateFilter={handleClearDateFilter}
      />

      {/* No Exact Matches Message */}
      {showNoExactMatchesMessage && (
        <NoResultsFound resetFilters={resetFilters} />
      )}

      {/* Events List Section */}
      <LazyEventsList 
        mainEvents={exactMatches}
        relatedEvents={similarEvents}
        isLoading={isLoading || isFilterLoading}
        // isRsvpLoading={rsvpLoading} // Removed, LazyEventsList uses loadingEventId
        onRsvp={user ? handleEventRsvp : undefined}
        showRsvpButtons={!!user}
        hasActiveFilters={hasActiveFilters}
        // loadingEventId should be passed here if available in EventsPageContentProps
        // For now, it's not, so it will be undefined, which is acceptable.
      />
    </div>
  );
};
