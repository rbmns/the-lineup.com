
import React from 'react';
import { Event } from '@/types';
import { EventCountDisplay } from '@/components/events/EventCountDisplay';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { LazyEventsList } from '@/components/events/LazyEventsList';

interface EventsResultsSectionProps {
  filteredEvents: Event[];
  isLoading: boolean;
  isVenuesLoading: boolean;
  isFilterLoading: boolean;
  hasActiveFilters: boolean;
  isNoneSelected: boolean;
  selectAll: () => void;
  handleRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons: boolean;
  loadingEventId?: string | null;
}

export const EventsResultsSection: React.FC<EventsResultsSectionProps> = ({
  filteredEvents,
  isLoading,
  isVenuesLoading,
  isFilterLoading,
  hasActiveFilters,
  isNoneSelected,
  selectAll,
  handleRsvp,
  showRsvpButtons,
  loadingEventId
}) => {
  // Update events count for display
  const eventsCount = filteredEvents.length;

  return (
    <div className="space-y-8">
      {/* Hide the EventCountDisplay */}
      <EventCountDisplay count={eventsCount} hidden={true} />
      
      {/* Show NoResultsFound when there are no event types selected */}
      {isNoneSelected ? (
        <NoResultsFound 
          resetFilters={selectAll}
          message="No event types selected. Select at least one event type to see events."
        />
      ) : (
        <LazyEventsList 
          mainEvents={filteredEvents}
          relatedEvents={[]} 
          isLoading={isLoading || isVenuesLoading || isFilterLoading}
          onRsvp={handleRsvp}
          showRsvpButtons={showRsvpButtons}
          hasActiveFilters={hasActiveFilters}
          loadingEventId={loadingEventId}
          hideCount={true}
        />
      )}
    </div>
  );
};
