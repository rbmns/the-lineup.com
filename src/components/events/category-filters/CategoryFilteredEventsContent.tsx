
import React from 'react';
import { Event } from '@/types';
import { EventsList } from '@/components/events/EventsList';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';

interface CategoryFilteredEventsContentProps {
  showNoExactMatchesMessage: boolean;
  resetFilters: () => void;
  exactMatches: Event[];
  similarEvents: Event[];
  isLoading: boolean;
  isFilterLoading: boolean;
  hasActiveFilters: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean>;
  loadingEventId?: string;
}

export const CategoryFilteredEventsContent: React.FC<CategoryFilteredEventsContentProps> = ({
  showNoExactMatchesMessage,
  resetFilters,
  exactMatches,
  similarEvents,
  isLoading,
  isFilterLoading,
  hasActiveFilters,
  onRsvp,
  loadingEventId
}) => {
  if (showNoExactMatchesMessage) {
    return (
      <NoResultsFound 
        resetFilters={resetFilters}
        message="No events match your current filters."
      />
    );
  }

  return (
    <div className="space-y-8">
      <EventsList
        events={exactMatches}
        onRsvp={onRsvp}
        showRsvpButtons={!!onRsvp}
        isLoading={isLoading || isFilterLoading}
        hasActiveFilters={hasActiveFilters}
        similarEvents={similarEvents}
        loadingEventId={loadingEventId}
      />
    </div>
  );
};
