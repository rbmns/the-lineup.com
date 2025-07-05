
import React from 'react';
import { Event } from '@/types';
import { EventCountDisplay } from '@/components/events/EventCountDisplay';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { LazyEventsList } from '@/components/events/LazyEventsList';

interface EventsResultsSectionProps {
  filteredEvents: Event[];
  hasActiveFilters: boolean;
  resetFilters: () => void;
  eventsLoading: boolean;
  isFilterLoading: boolean;
  user: any;
}

export const EventsResultsSection: React.FC<EventsResultsSectionProps> = ({
  filteredEvents,
  hasActiveFilters,
  resetFilters,
  eventsLoading,
  isFilterLoading,
  user
}) => {
  const eventsCount = filteredEvents.length;
  const showNoResults = !eventsLoading && !isFilterLoading && filteredEvents.length === 0;

  return (
    <div className="space-y-8 mt-8">
      {/* Events count */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {eventsLoading ? 'Loading events...' : `${eventsCount} events found`}
        </p>
      </div>
      
      {showNoResults ? (
        <NoResultsFound 
          resetFilters={resetFilters}
          message={hasActiveFilters ? "No events found matching your filters." : "No events available."}
        />
      ) : (
        <LazyEventsList 
          mainEvents={filteredEvents}
          relatedEvents={[]} 
          isLoading={eventsLoading || isFilterLoading}
          showRsvpButtons={false}
          hasActiveFilters={hasActiveFilters}
          hideCount={true}
        />
      )}
    </div>
  );
};
