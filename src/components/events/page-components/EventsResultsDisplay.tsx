
import React from 'react';
import { Event } from '@/types';
import { EventsList } from '@/components/events/EventsList';
import { EventsEmptyState } from '@/components/events/list-components/EventsEmptyState';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';

interface EventsResultsDisplayProps {
  filteredEvents: Event[];
  similarEvents: Event[];
  isLoading: boolean;
  isVenuesLoading: boolean;
  isFilterLoading: boolean;
  hasActiveFilters: boolean;
  handleRsvp: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  showRsvpButtons: boolean;
  loadingEventId: string | null;
  isNoneSelected: boolean;
  selectAll: () => void;
  onEventSelect?: (eventId: string | null) => void;
  selectedEventId?: string | null;
  isOverlayMode?: boolean;
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
  selectAll,
  onEventSelect,
  selectedEventId,
  isOverlayMode = false
}) => {
  // Show loading state
  if (isLoading || isVenuesLoading || isFilterLoading) {
    return <EventsLoadingState />;
  }

  // Show no results state when filters are active but no events match
  // Note: isNoneSelected means no categories are selected, which should show ALL events, not empty state
  if (hasActiveFilters && filteredEvents.length === 0) {
    return <NoResultsFound resetFilters={selectAll} />;
  }

  // Show events list - the isNoneSelected case should still show events if they exist
  return (
    <EventsList
      events={filteredEvents}
      onRsvp={showRsvpButtons ? handleRsvp : undefined}
      showRsvpButtons={showRsvpButtons}
      loadingEventId={loadingEventId}
      hasActiveFilters={hasActiveFilters}
      similarEvents={similarEvents}
      onEventSelect={onEventSelect}
      selectedEventId={selectedEventId}
      isOverlayMode={isOverlayMode}
    />
  );
};
