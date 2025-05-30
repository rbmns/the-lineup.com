
import React from 'react';
import { CategoryFilteredEventsContent } from '@/components/events/category-filters/CategoryFilteredEventsContent';
import { Event } from '@/types';

interface EventsResultsSectionProps {
  filteredEvents: Event[];
  hasActiveFilters: boolean;
  resetFilters: () => void;
  eventsLoading: boolean;
  isFilterLoading: boolean;
  user: any;
  enhancedHandleRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean>;
  loadingEventId?: string;
}

export const EventsResultsSection: React.FC<EventsResultsSectionProps> = ({
  filteredEvents,
  hasActiveFilters,
  resetFilters,
  eventsLoading,
  isFilterLoading,
  user,
  enhancedHandleRsvp,
  loadingEventId,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">All Events</h2>
      </div>

      <CategoryFilteredEventsContent 
        showNoExactMatchesMessage={filteredEvents.length === 0 && hasActiveFilters}
        resetFilters={resetFilters}
        exactMatches={filteredEvents}
        similarEvents={[]}
        isLoading={eventsLoading || isFilterLoading} 
        isFilterLoading={isFilterLoading}
        hasActiveFilters={hasActiveFilters}
        onRsvp={user ? enhancedHandleRsvp : undefined}
        loadingEventId={loadingEventId}
      />
    </div>
  );
};
