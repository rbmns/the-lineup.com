
import React from 'react';
import { Event } from '@/types';
import { EventCountDisplay } from '@/components/events/EventCountDisplay';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { LazyEventsList } from '@/components/events/LazyEventsList';

interface EventsResultsDisplayProps {
  filteredEvents: Event[];
  similarEvents: Event[];
  isLoading: boolean;
  isVenuesLoading: boolean;
  isFilterLoading: boolean;
  hasActiveFilters: boolean;
  handleRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons: boolean;
  loadingEventId?: string | null;
  isNoneSelected: boolean;
  selectAll: () => void;
}

export const EventsResultsDisplay: React.FC<EventsResultsDisplayProps> = ({
  filteredEvents,
  similarEvents,
  isLoading,
  isVenuesLoading,
  isFilterLoading,
  hasActiveFilters,
  handleRsvp,
  showRsvpButtons,
  loadingEventId,
  isNoneSelected,
  selectAll
}) => {
  // Update events count for display
  const eventsCount = filteredEvents.length;

  return (
    <div className="space-y-8">
      {/* Events count display */}
      <EventCountDisplay count={eventsCount} />

      {/* Show NoResultsFound when there are no event types selected */}
      {isNoneSelected ? (
        <NoResultsFound 
          resetFilters={selectAll}
          message="No event types selected. Select at least one event type to see events."
        />
      ) : (
        <LazyEventsList 
          mainEvents={filteredEvents}
          relatedEvents={similarEvents} 
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
